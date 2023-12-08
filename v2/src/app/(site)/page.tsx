import React from "react";
import TitleSection from "./_components/title-section";

const HomePage = () => {
  return (
    <section>
      <div className="overflow-hidden flex flex-col justify-center h-screen px-4 pb-10">
        <TitleSection
          title="Work, Plan, Share."
          subheading="Cloud Collaborate is the connected workspace where better, faster work happens."
        />
      </div>
    </section>
  );
};

export default HomePage;
