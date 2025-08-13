import React, { useState } from 'react';
import { Box, Heading, Text, VStack, Link, FormControl, FormLabel, Input, Textarea, Button, useToast } from '@chakra-ui/react';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulación de envío (puedes conectar a backend si lo deseas)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast({
        title: 'Mensaje enviado',
        description: 'Gracias por contactarnos. Te responderemos pronto.',
        status: 'success',
        duration: 6000,
        isClosable: true,
      });
      setForm({ name: '', email: '', message: '' });
    }, 1200);
  };

  return (
    <Box minH="80vh" bgGradient="linear(to-br, pink.50, purple.50)" py={{ base: 8, md: 12 }}>
      <Box maxW="lg" mx="auto" bg="white" p={8} borderRadius="xl" boxShadow="lg">
        <VStack spacing={6} align="stretch">
          <Heading as="h2" size="lg" color="pink.500" textAlign="center">Contacto</Heading>
          <Text textAlign="center">¿Tienes dudas, sugerencias o quieres hacer un pedido especial?</Text>
          <Text textAlign="center">Puedes escribirnos a:
            <Link href="mailto:info@tuucapricho.com" color="pink.500" fontWeight="bold" ml={1}>
              info@tuucapricho.com
            </Link>
          </Text>
          <Text textAlign="center">O envíanos un WhatsApp:
            <Link href="https://wa.me/34123456789" color="green.500" fontWeight="bold" ml={1} isExternal>
              +34 123 456 789
            </Link>
          </Text>

          <Box as="form" onSubmit={handleSubmit} bg="gray.50" p={6} borderRadius="lg" boxShadow="md">
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Nombre</FormLabel>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Mensaje</FormLabel>
                <Textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="¿En qué podemos ayudarte?"
                  rows={5}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="pink"
                size="lg"
                isLoading={isSubmitting}
                isDisabled={isSubmitting || !form.name || !form.email || !form.message}
                w="100%"
              >
                Enviar Mensaje
              </Button>
              {submitted && (
                <Text color="green.500" textAlign="center" fontWeight="bold">
                  ¡Mensaje enviado correctamente!
                </Text>
              )}
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}

export default Contact; 