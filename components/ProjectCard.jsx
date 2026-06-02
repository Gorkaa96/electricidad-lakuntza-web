import { ArrowRight, MapPin } from 'lucide-react';

export default function ProjectCard({ project }) {
  return (
    <a href={`/trabajos-realizados/${project.slug}`} className="group block overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-card transition hover:-translate-y-1 hover:border-lakuntza-green/40 hover:shadow-2xl">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-950 via-[#1D2420] to-lakuntza-greenDark text-white">
        {project.coverImage ? (
          <img
            src={project.coverImage.url}
            alt={project.coverImage.alt || project.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="p-7 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">{project.category}</p>
            <p className="mt-4 text-3xl font-black tracking-[-0.06em]">{project.shortTitle}</p>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/80 to-transparent p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/75">{project.category}</p>
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
        <span className="mt-5 inline-flex items-center text-sm font-black text-lakuntza-greenDark">
          Ver trabajo <ArrowRight className="ml-2 transition group-hover:translate-x-1" size={17} />
        </span>
      </div>
    </a>
  );
}
