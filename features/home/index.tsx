'use client';

import React from 'react';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ComponentsSection } from './components/ComponentsSection';
import { FooterSection } from './components/FooterSection';

function HomePage(): React.ReactElement {
  return (
    <div className="flex flex-col bg-background text-foreground">
      <HeroSection />
      <ServicesSection />
      <ProjectsSection />
      <ComponentsSection />
      <FooterSection />
    </div>
  );
}

export default HomePage;
