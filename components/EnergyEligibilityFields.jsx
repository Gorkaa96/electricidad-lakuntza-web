'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const blockedValues = ['si', 'familia_numerosa'];

export default function EnergyEligibilityFields() {
  const [supplyType, setSupplyType] = useState('luz');
  const [bonusStatus, setBonusStatus] = useState('');
  const statusRef = useRef(null);
  const includesElectricity = supplyType === 'luz' || supplyType === 'luz_gas';
  const blocked = includesElectricity && blockedValues.includes(bonusStatus);
  const uncertain = includesElectricity && bonusStatus === 'no_lo_se';

  useEffect(() => {
    if (statusRef.current) {
      statusRef.current.setCustomValidity(blocked
        ? 'No podemos tramitar contratos eléctricos con bono social. Para continuar, selecciona solo Gas o consulta con una comercializadora de referencia.'
        : '');
    }
  }, [blocked]);

  return (
    <div className="border-t border-neutral-200 pt-7">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-500">1. Qué quieres revisar</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-neutral-800">
          Suministro *
          <select name="supplyType" required value={supplyType} onChange={(e) => setSupplyType(e.target.value)} className="focus-ring min-h-12 w-full min-w-0 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base outline-none focus:border-lakuntza-green sm:text-sm">
            <option value="luz">Luz</option>
            <option value="gas">Gas</option>
            <option value="luz_gas">Luz y gas</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-neutral-800">
          Tipo de cliente *
          <select name="customerType" required defaultValue="vivienda" className="focus-ring min-h-12 w-full min-w-0 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base outline-none focus:border-lakuntza-green sm:text-sm">
            <option value="vivienda">Vivienda</option>
            <option value="negocio">Negocio</option>
            <option value="comunidad">Comunidad</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-neutral-800 sm:col-span-2">
          ¿Tienes bono social eléctrico, título de familia numerosa o podrías tener derecho a él? *
          <select ref={statusRef} name="bonusStatus" required value={bonusStatus} onChange={(e) => setBonusStatus(e.target.value)} className="focus-ring min-h-12 w-full min-w-0 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base outline-none focus:border-lakuntza-green sm:text-sm">
            <option value="" disabled>Selecciona una opción</option>
            <option value="si">Tengo bono social eléctrico</option>
            <option value="familia_numerosa">Tengo título de familia numerosa</option>
            <option value="no">No, ninguna de estas situaciones</option>
            <option value="no_lo_se">No lo sé / tengo dudas</option>
          </select>
        </label>
      </div>
      {blocked ? (
        <div role="alert" className="mt-4 flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <AlertTriangle className="mt-0.5 shrink-0" size={20} />
          <div>
            <p className="font-black">Para tu suministro eléctrico, consulta primero el bono social.</p>
            <p className="mt-1">Feníe Energía no es comercializadora de referencia y no puede aplicar el bono social. No recomendamos tramitar aquí un cambio de luz que pueda perjudicarte. Puedes solicitar **solo gas** si te interesa, o consultar alarmas por separado.</p>
            <a className="mt-2 inline-block font-black underline underline-offset-4" href="https://www.miteco.gob.es/es/energia/pobreza-energetica/pe-001/preguntas-frecuentes-bono-social.html" target="_blank" rel="noopener noreferrer">Información oficial sobre bono social</a>
          </div>
        </div>
      ) : uncertain ? (
        <div role="status" className="mt-4 flex gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
          <AlertTriangle className="mt-0.5 shrink-0 text-amber-700" size={19} />
          <p>Antes de cambiar de comercializadora eléctrica conviene confirmar si tienes bono social o derecho a solicitarlo. La revisión no supone un cambio automático.</p>
        </div>
      ) : bonusStatus === 'no' ? (
        <p className="mt-3 flex items-center gap-2 text-xs text-neutral-600"><CheckCircle2 size={15} className="text-lakuntza-greenDark" /> Puedes continuar con el envío de tu factura.</p>
      ) : null}
    </div>
  );
}
