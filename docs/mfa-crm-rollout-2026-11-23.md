# Electricidad Lakuntza — Despliegue controlado de MFA TOTP

Fecha: 23/11/2026. **Preparado en rama de integración, NO activado ni probado en producción.** No forzar sesiones ni crear usuarios reales sin aprobación.

## Código preparado
- Challenge: /admin/mfa y app/admin/mfa/MfaChallenge.jsx.
- Inscripción: /admin/seguridad y app/admin/seguridad/SecurityFactors.jsx.
- Inicio de sesión y guardas: app/admin/login, lib/admin.js, lib/admin-mfa.mjs.
- Tests puros: tests/admin-mfa.test.mjs.
- Kill switch: variable de servidor CRM_MFA_ROLLOUT_ENABLED=true. Ausente o distinta de true, MFA está desactivada y oculta, conservando el login anterior. **No configurarla en Vercel todavía.**
- No se ha modificado ningún factor MFA remoto.

## Auditoría remota 23/11
- 1 usuario Auth, 1 admin activo, 0 factores MFA verificados.
- Sin restricciones AAL en RLS public.* ni storage.objects.
- authenticated tiene USAGE sobre auth pero NO SELECT directo sobre auth.mfa_factors (consulta has_table_privilege). app_private sí admite USAGE para authenticated.
- Por ello no copiar directamente la política RLS oficial que consulta auth.mfa_factors sin resolver privilegios. Diseñar una función SECURITY DEFINER mínima, con search_path vacío, acceso solo a auth.uid(), sin devolver metadatos Auth.

## Borrador RLS para revisión en entorno aislado (NO ejecutar en producción)

Debe convertirse en migración oficial usando Supabase CLI, adaptarse a permisos y probarse con dos usuarios ficticios. Ejemplo ilustrativo:

~~~sql
CREATE OR REPLACE FUNCTION app_private.mfa_satisfied_for_current_user()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    (select auth.uid()) IS NOT NULL
    AND (
      (select auth.jwt()->>'aal') = 'aal2'
      OR NOT EXISTS (
        SELECT 1 FROM auth.mfa_factors f
        WHERE f.user_id = (select auth.uid()) AND f.status = 'verified'
      )
    );
$$;
REVOKE ALL ON FUNCTION app_private.mfa_satisfied_for_current_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_private.mfa_satisfied_for_current_user() TO authenticated;

CREATE POLICY "MFA necesario si está inscrito"
ON public.invoice_review_leads
AS RESTRICTIVE FOR ALL TO authenticated
USING ((select app_private.mfa_satisfied_for_current_user()))
WITH CHECK ((select app_private.mfa_satisfied_for_current_user()));
~~~

Replicar tras pruebas para las demás tablas CRM: public.admin_users, public.invoice_ocr_results, public.fenie_proposals, public.invoice_lead_events, public.commercial_leads, public.commercial_lead_events, public.projects, public.project_images y storage.objects. Los permisos existentes son permisivos; esta condición restrictiva añade MFA sin sustituir las autorizaciones por rol. Los accesos públicos de anon no deben alterarse. Comprobar propietario/grants, políticas, integridad y que no se pueda usar la función para consultar Auth. **Aún no aplicado.**

## Pruebas necesarias antes de habilitar
1. Base aislada con administrador y agente sintéticos, sin el usuario real de producción.
2. Activar el flag solo localmente, inscribir TOTP, comprobar AAL2 y que el CRM funciona.
3. Salir y entrar otra vez: con contraseña sola AAL1, debe exigir /admin/mfa y denegar lectura/edición de datos y Storage mediante RLS; tras TOTP recuperar acceso según rol.
4. Probar agentes sin acceso ajeno, endpoints de descarga y Server Actions; los clientes con Auth directa también deben quedar protegidos.
5. Documentar alta, pérdida y sustitución de autenticador. Usar segundo factor independiente o recuperación administrativa controlada antes de activar el único owner. La integración no ofrece códigos de recuperación estándar.
6. Validar cierre de sesiones previas tras inscribir y pruebas de fallo de red.
7. Convertir el borrador SQL en migración probada y reversible, validar seguridad mediante CI y advisors, realizar inscripción del propietario solo cuando sea seguro.
8. No crear cuentas de Javier y Kristina hasta autorizarlo y acordar SMTP/invitaciones.

## Dependencias externas
- Restauración integral sigue pendiente en PC-GHU (error de rol reservado supabase_admin en primer intento). Mantener backups y SQL lejos del portátil corporativo.
- Vercel Hobby no permite uso comercial; resolver plan o alternativa compatible antes de habilitar captación.
- Documentación: https://supabase.com/docs/guides/auth/auth-mfa y https://supabase.com/docs/guides/auth/auth-mfa/totp .
