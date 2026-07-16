import logoUrl from "@/assets/logo-voz-estrategica.png";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-12 w-auto" }: LogoProps) {
  return (
    <img
      src={logoUrl}
      alt="Voz Estratégica"
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}
