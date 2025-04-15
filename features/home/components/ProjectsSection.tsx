import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
}

const projects: Project[] = [
  {
    title: 'Project 1',
    description: 'A brief description of project 1',
    image: '/project1.jpg',
    link: '/projects/1',
  },
  {
    title: 'Project 2',
    description: 'A brief description of project 2',
    image: '/project2.jpg',
    link: '/projects/2',
  },
  {
    title: 'Project 3',
    description: 'A brief description of project 3',
    image: '/project3.jpg',
    link: '/projects/3',
  },
];

export function ProjectsSection(): React.ReactElement {
  return (
    <section
      id="projects"
      className="py-12 sm:py-16 md:py-20 bg-muted px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Projects
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground">
            Check out some of my recent work
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg"
            >
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-xl sm:text-2xl">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex-grow">
                <div className="relative h-40 sm:h-48 w-full rounded-md overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={project.link}>View Project</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
