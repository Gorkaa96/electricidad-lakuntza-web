import Image from 'next/image';

export default function Logo({ compact = false, dark = false }) {
  const imgSize = compact ? 43 : 54;
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white" style={{ width: imgSize, height: imgSize }}>
        <Image src="/logo-lakuntza.png" alt="" width={imgSize} height={imgSize} priority className="h-full w-full object-contain" />
      </span>
      <div className="min-w-0 leading-tight">
        <p className={`${compact ? 'text-[15px]' : 'text-lg'} font-semibold tracking-[-.025em] ${dark ? 'text-white' : 'text-[#142118]'}`}>
          Electricidad Lakuntza
        </p>
        <p className={`mt-1 text-xs font-medium ${dark ? 'text-white/65' : 'text-neutral-500'}`}>
          Elektrizitatea
        </p>
      </div>
    </div>
  );
}
