import React from 'react';

interface RuleSectionProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

const RuleSection = ({ title, subtitle, children }: RuleSectionProps) => {
    return (
        <section className="mb-8 last:mb-0">
            <h2 className="section-header">
                {title}
            </h2>
            {subtitle && <p className="text-lg text-gray-600 italic mb-4">{subtitle}</p>}
            <div className="space-y-4 text-gray-700 leading-relaxed">
                {children}
            </div>
        </section>
    );
};

export default RuleSection;
