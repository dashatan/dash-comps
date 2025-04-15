'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Code, Brush, Monitor, Instagram } from 'iconsax-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Github, Linkedin } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Web Dashboard',
    description: 'A modern dashboard with analytics and data visualization',
    image: '/window.svg',
    tags: ['React', 'TypeScript', 'Tailwind'],
  },
  {
    id: 2,
    title: 'File Manager',
    description: 'Drag and drop file management system with cloud storage',
    image: '/file.svg',
    tags: ['Next.js', 'Firebase', 'shadcn/ui'],
  },
  {
    id: 3,
    title: 'Global Network',
    description: 'Interactive network visualization for global connections',
    image: '/globe.svg',
    tags: ['D3.js', 'React', 'API Integration'],
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col items-center justify-center bg-background text-foreground overflow-hidden pt-16 px-4"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Hi, I am <span className="text-primary">Daniel Ochi</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            A seasoned <span className="text-primary">Frontend Developer</span>{' '}
            transforming ideas into stunning digital experiences. Let's create
            something amazing!
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Github className="h-6 w-6" />
              </Button>
            </Link>
            <Link href="mailto:example@email.com">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:text-[#00ffff] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </Button>
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:text-[#00ffff] transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </Button>
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:text-[#00ffff] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Button>
            </Link>
          </div>
          <div className="mt-12">
            <Button className="bg-[#00ffff] text-black hover:bg-[#00ffff]/90 transition-colors px-8 py-6 text-lg font-semibold">
              View Resume
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 px-4 bg-background text-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What <span className="text-primary">I do</span>.
            </h2>
            <p className="text-muted-foreground">SERVICES</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Web Development Card */}
            <div className="group bg-card p-8 rounded-lg border border-border hover:border-primary transition-all duration-300">
              <div className="text-primary text-8xl font-bold opacity-20 mb-4">
                01
              </div>
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">
                Web Development
              </h3>
              <p className="text-muted-foreground text-sm">
                I use my knowledge of various programming languages such as
                HTML5, CSS3, JAVASCRIPT, TAILWIND to build digital solutions for
                users.
              </p>
            </div>

            {/* UI Design Card */}
            <div className="group bg-card p-8 rounded-lg border border-border hover:border-primary transition-all duration-300">
              <div className="text-primary text-8xl font-bold opacity-20 mb-4">
                02
              </div>
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">
                UI Design
              </h3>
              <p className="text-muted-foreground text-sm">
                Crafting user-centric digital experiences that seamlessly blend
                aesthetics and functionality. Expert in user-centered design and
                responsive interfaces.
              </p>
            </div>

            {/* Content Writing Card */}
            <div className="group bg-card p-8 rounded-lg border border-border hover:border-primary transition-all duration-300">
              <div className="text-primary text-8xl font-bold opacity-20 mb-4">
                03
              </div>
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">
                Content Writing
              </h3>
              <p className="text-muted-foreground text-sm">
                Weaving impactful narratives and delivering engaging content
                that resonates with readers. Skillfully combining creativity
                with research to create compelling pieces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 px-4 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Featured <span className="text-primary">Projects</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              A selection of my recent work in web development and design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-500"
              >
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10" />
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="relative p-6 z-20 -mt-12">
                  <h3 className="text-2xl font-semibold mb-3 text-card-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div id="components" className="mt-32">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Featured Components
              </h2>
              <p className="text-lg text-muted-foreground">
                Beautiful and reusable UI components built with modern web
                technologies
              </p>
            </div>

            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {[1, 2, 3].map((item) => (
                  <CarouselItem
                    key={item}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-2">
                      <div className="group rounded-xl overflow-hidden border border-border/50 backdrop-blur-sm hover:border-primary/20 bg-card/50 p-8 h-[300px] flex flex-col items-center justify-center transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                        <div className="h-32 w-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                          <Code
                            size="40"
                            variant="Bulk"
                            className="text-primary group-hover:rotate-12 transition-transform duration-500"
                          />
                        </div>
                        <h4 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                          Component {item}
                        </h4>
                        <p className="text-sm text-muted-foreground text-center max-w-xs">
                          Interactive UI component with modern design and smooth
                          animations
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-12 hover:bg-primary hover:text-primary-foreground" />
              <CarouselNext className="-right-12 hover:bg-primary hover:text-primary-foreground" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-gradient-to-b from-background to-secondary/5 border-t border-border/50 py-24 px-4 md:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Let's Connect
            </h2>
            <p className="text-lg text-muted-foreground">
              Get in touch for collaborations or just to say hello
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-4 text-primary">About</h3>
              <p className="text-muted-foreground leading-relaxed">
                Passionate about creating modern web experiences with clean code
                and beautiful design. Let's build something amazing together.
              </p>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-4 text-primary">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    About Me
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    All Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-4 text-primary">
                Social
              </h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                  asChild
                >
                  <Link
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size="20" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                  asChild
                >
                  <Link
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin size="20" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                  asChild
                >
                  <Link
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram size="20" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Creative Developer. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
