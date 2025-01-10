import React from 'react';
import type { Template } from '~/types/template';
import { STARTER_TEMPLATES } from '~/utils/constants';
import WithTooltip from '~/components/ui/Tooltip';

interface FrameworkLinkProps {
  template: Template;
}

const FrameworkLink: React.FC<FrameworkLinkProps> = ({ template }) => (
  <WithTooltip
    tooltip={
      <div className="text-center">
        <div className="font-bold dark:text-[#052E16] text-[#DCFCE7]">{template.label}</div>
      </div>
    }
    className="!bg-[#22C55E]"
    arrowClassName="!fill-[#22C55E]"
    sideOffset={15}
  >
    <a
      href={`/git?url=https://github.com/${template.githubRepo}.git`}
      data-state="closed"
      data-discover="true"
      className="items-center justify-center"
    >
      <div
        className={`inline-block ${template.icon} w-14 h-14 text-4xl transition-theme grayscale opacity-25 hover:grayscale-0 hover:opacity-75 transition-all duration-500`}
      />
    </a>
  </WithTooltip>
);

const StarterTemplates: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-sm text-gray-500">Alebo začneme nový projekt z boilerplate</span>
      <div className="flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {STARTER_TEMPLATES.map((template) => (
            <FrameworkLink key={template.name} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StarterTemplates;
