export default function Badge({ children, dark = false }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] ${dark ? 'border-white/15 bg-white/10 text-white' : 'border-lakuntza-green/25 bg-[#F3FAEF] text-lakuntza-greenDark'}`}>
      {children}
    </span>
  );
}
