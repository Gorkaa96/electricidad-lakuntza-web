import Image from 'next/image';

export default function Logo({ compact = false, dark = false }) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/logo-lakuntza.svg"
        alt="Electricidad Lakuntza"
        width={compact ? 44 : 56}
        height={compact ? 44 : 56}
        priority
        className="rounded-full logo-shadow"
      />
      <div className="leading-tight">
        <p className={`${compact ? 'text-base' : 'text-lg'} font-black tracking-tight ${dark ? 'text-white' : 'text-neutral-950'}`}>
          Electricidad Lakuntza
        </p>
        <p className={`text-[10px] font-black uppercase tracking-[0.28em] ${dark ? 'text-white/55' : 'text-neutral-500'}`}>
          Elektrizitatea
        </p>
      </div>
    </div>
  );
}
