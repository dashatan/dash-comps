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
    <div id="components" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16 space-y-3 md:space-y-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Featured Components
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          Beautiful and reusable UI components built with modern web
          technologies
        </p>
      </div>

      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent className="px-2 sm:px-4">
          {[1, 2, 3].map((item) => (
            <CarouselItem
              key={item}
              className="basis-full xs:basis-1/2 md:basis-1/2 lg:basis-1/3 p-1 sm:p-2"
            >
              <div className="group rounded-xl overflow-hidden border border-border/50 backdrop-blur-sm hover:border-primary/20 bg-card/50 p-4 sm:p-6 md:p-8 h-[250px] sm:h-[300px] flex flex-col items-center justify-center transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Code2 className="h-8 w-8 md:h-10 md:w-10 text-primary group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <h4 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 group-hover:text-primary transition-colors">
                  Component {item}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-xs">
                  Interactive UI component with modern design and smooth
                  animations
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden sm:block">
          <CarouselPrevious className="-left-4 md:-left-12 hover:bg-primary hover:text-primary-foreground" />
          <CarouselNext className="-right-4 md:-right-12 hover:bg-primary hover:text-primary-foreground" />
        </div>
      </Carousel>
    </div>
  );
}
