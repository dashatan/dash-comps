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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
          Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 rounded-lg bg-card text-card-foreground shadow-lg hover:shadow-xl transition-shadow"
            >
              <service.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
