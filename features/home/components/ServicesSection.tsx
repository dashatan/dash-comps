import React from 'react';
import { Code2, Layout, Palette } from 'lucide-react';

const services = [
  {
    title: 'Web Development',
    description:
      'Building responsive and performant web applications using modern technologies.',
    icon: Code2,
  },
  {
    title: 'UI/UX Design',
    description:
      'Creating intuitive and engaging user interfaces with a focus on user experience.',
    icon: Palette,
  },
  {
    title: 'Frontend Architecture',
    description:
      'Designing scalable and maintainable frontend architectures for complex applications.',
    icon: Layout,
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      className="py-12 sm:py-16 md:py-20 bg-background px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Services
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground">
            Specialized expertise to help bring your vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-5 sm:p-6 rounded-lg bg-card text-card-foreground shadow hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border border-border/50 hover:border-primary/20"
            >
              <div className="flex items-center justify-center sm:justify-start">
                <service.icon className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-4" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center sm:text-left">
                {service.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground text-center sm:text-left">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
