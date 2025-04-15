import React from 'react';
import { Code2 } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

export function ComponentsSection(): React.ReactElement {
  return (
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
            <CarouselItem key={item} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-2">
                <div className="group rounded-xl overflow-hidden border border-border/50 backdrop-blur-sm hover:border-primary/20 bg-card/50 p-8 h-[300px] flex flex-col items-center justify-center transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                  <div className="h-32 w-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Code2 className="h-10 w-10 text-primary group-hover:rotate-12 transition-transform duration-500" />
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
  );
}
