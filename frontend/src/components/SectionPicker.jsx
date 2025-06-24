import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, Heading } from '@chakra-ui/react';
import TemplateSelector from './TemplateSelector';

const SectionPicker = ({ sections, dispatch }) => {
  return (
    <Accordion allowMultiple>
      {sections.map((section) => (
        <AccordionItem key={section.name}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Heading size="sm">{section.name}</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <TemplateSelector sectionName={section.name} templates={section.templates} dispatch={dispatch} />
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default SectionPicker;