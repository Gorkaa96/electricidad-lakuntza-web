import { MapPin } from 'lucide-react';

export default function ProjectCard({ project }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-card transition hover:-translate-y-1 hover:border-lakuntza-green/40 hover:shadow-2xl">
      <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-neutral-950 via-[#1D2420] to-lakuntza-greenDark p-7 text-white">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">{project.category}</p>
          <p className="mt-4 text-3xl font-black tracking-[-0.06em]">{project.shortTitle}</p>
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-lakuntza-greenDark">
          <MapPin size={14} />
          <span>{project.location}</span>
          {project.year ? <span className="text-neutral-400">· {project.year}</span> : null}
        </div>
        <h3 className="mt-4 text-xl font-black tracking-[-0.04em] text-neutral-950">{project.title}</h3>
        <p className="mt-3 text-sm leading-6 text-neutral-600">{project.description}</p>
      </div>
    </article>
  );
}
