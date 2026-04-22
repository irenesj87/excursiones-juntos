import { BackpackIcon } from "../../ui/Icons";

const CONTENT = {
	eyebrow: "Nuestra Filosofía",
	title: {
		start: "Descubriendo el placer de",
		highlight: "explorar.",
	},
	description:
		"Para nosotros, la verdadera aventura no se mide en kilómetros, sino en la calma de un paisaje y en las historias que nacen alrededor de un sendero. Nos une el respeto por el silencio de los bosques, la luz de la mañana y el compromiso de dejar una huella mínima en la tierra que tanto nos regala.",
};

export function AboutUs() {
	return (
		<section className="bg-card py-24 px-6" aria-labelledby="about-us-heading">
			<div className="flex flex-col items-center text-center max-w-screen-xl mx-auto">
				<div className="text-5xl mb-4 text-primary" aria-hidden="true">
					<BackpackIcon size={48} />
				</div>
				<div className="font-semibold tracking-[0.15em] text-xs uppercase text-muted-foreground mb-2">
					{CONTENT.eyebrow}
				</div>
				<h2
					id="about-us-heading"
					className="font-light text-3xl md:text-4xl text-foreground leading-[1.1] tracking-tight text-balance mb-4"
				>
					{CONTENT.title.start}{" "}
					<span className="font-semibold text-primary">
						{CONTENT.title.highlight}
					</span>
				</h2>
				<p className="text-base md:text-lg leading-[1.8] text-foreground max-w-[37.5rem] mt-6">
					{CONTENT.description}
				</p>
			</div>
		</section>
	);
}
