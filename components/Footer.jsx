import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-neutral-950 py-10 text-white/55">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full">
            <Image src="/logo-lakuntza.png" alt="Electricidad Lakuntza" width={44} height={44} className="h-full w-full rounded-full object-contain" />
          </span>
          <div>
            <p className="text-sm font-black text-white">Electricidad Lakuntza · Elektrizitatea</p>
            <p className="text-xs">Instalaciones eléctricas · Telecomunicaciones · Asesoría energética</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 text-xs font-black uppercase tracking-[.14em]">
          <a href="/#servicios" className="hover:text-white">Servicios</a>
          <a href="/#trabajos" className="hover:text-white">Trabajos</a>
          <a href="/trabajos-realizados" className="hover:text-white">Galería</a>
          <a href="/#energia" className="hover:text-white">Luz y gas</a>
          <a href="/#contacto" className="hover:text-white">Contacto</a>
          <a href="/aviso-legal" className="hover:text-white">Aviso legal</a>
          <a href="/privacidad" className="hover:text-white">Privacidad</a>
          <a href="/cookies" className="hover:text-white">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
