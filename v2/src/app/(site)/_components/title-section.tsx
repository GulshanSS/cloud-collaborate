import { Button } from "@/components/ui/button";
import React from "react";

interface TitleSectionProps {
  title: string;
  subheading?: string;
}

const TitleSection: React.FC<TitleSectionProps> = ({ title, subheading }) => {
  return (
    <React.Fragment>
      <section className="sm:flex sm:flex-col sm:items-center gap-4">
        <div className="sm:flex gap-1 text-5xl font-extrabold">
          <h1>Cloud</h1>
          <h1 className="text-red-500">Collaborate</h1>
        </div>
        <h2 className=" font-bold text-xl md:text-3xl">{title}</h2>
        {subheading ? <h3 className=" text-sm lg:text-xl">{subheading}</h3> : null}
        <Button className="mt-10">Get Started</Button>
      </section>
    </React.Fragment>
  );
};

export default TitleSection;
