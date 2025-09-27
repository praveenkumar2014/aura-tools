'use client';

import { motion } from 'framer-motion';
import { ToolCard, AITool } from './ToolCard';

interface ToolsGridProps {
  tools: AITool[];
  title?: string;
  onLearnMore?: (tool: AITool) => void;
}

export const ToolsGrid = ({ tools, title = "Featured AI Tools", onLearnMore }: ToolsGridProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Curated collection of the most powerful AI tools to supercharge your workflow
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {tools.map((tool) => (
            <motion.div key={tool.id} variants={itemVariants}>
              <ToolCard tool={tool} onLearnMore={onLearnMore} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};