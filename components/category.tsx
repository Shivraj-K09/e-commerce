import React from "react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "./animated-primitives/animated-background";
import { Baby, Dumbbell, Tags } from "lucide-react";
import { GenderFemale, GenderMale } from "@phosphor-icons/react/dist/ssr";

export function Category() {
  const categories = [
    { name: "Woman", icon: GenderFemale },
    { name: "Men", icon: GenderMale },
    { name: "Kids", icon: Baby },
    { name: "Sports", icon: Dumbbell },
    { name: "Sale", icon: Tags },
  ];

  return (
    <div className="sticky top-16 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b pb-3">
      <div className="flex pr-6 pl-4 items-center gap-3 w-full">
        <AnimatedBackground
          defaultValue={categories[0].name}
          className="rounded-lg bg-zinc-100 dark:bg-zinc-800"
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.3,
          }}
          enableHover
        >
          {categories.map(({ name, icon: Icon }, tab) => (
            <Button
              key={name}
              data-id={tab}
              variant="ghost"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              <span className="flex items-center">
                <Icon className="w-4 h-4 mr-1.5" />
                {name}
              </span>
            </Button>
          ))}
        </AnimatedBackground>
      </div>
    </div>
  );
}
