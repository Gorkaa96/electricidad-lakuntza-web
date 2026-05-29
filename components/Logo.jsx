import Image from 'next/image';

export default function Logo({ compact = false, dark = false }) {
  const sizeClass = compact ? 'h-11 w-11' : 'h-14 w-14';
  const imageSize = compact ? 44 : 56;

  return (
    <div className="flex items-center gap-3">
      <span className={`${sizeClass} logo-shadow relative flex shrink-0 items-center justify-center overflow-hidden rounded-full`}>
        <Image
          src="/logo-lakuntza.png"
          alt="Electricidad Lakuntza"
          width={imageSize}
          height={imageSize}
          priority
          className="h-full w-full rounded-full object-contain"
        />
      </span>
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
