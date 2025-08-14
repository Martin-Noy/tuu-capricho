import React, { useState } from 'react';
import { Box, Heading, Input, Button, FormControl, FormLabel, Textarea } from '@chakra-ui/react';

//TO-DO: Validar formato de fotos, mostrar errores detallados y permitir edición masiva de productos.
const AdminAddProduct = ({ onProductAdded }) => {
  const [form, setForm] = useState({
    name: '',
    basePrice: '',
    percentage: '',
    description: '',
    stock: '',
    photos: ''
  });
  const [csvFile, setCsvFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, photos: form.photos.split(',') })
      });
      if (res.ok) {
        setMessage('Producto agregado correctamente');
        setForm({ name: '', basePrice: '', percentage: '', description: '', stock: '', photos: '' });
        onProductAdded && onProductAdded();
      } else {
        setMessage('Error al agregar producto');
      }
    } catch {
      setMessage('Error de conexión');
    }
  };

  const handleCsvChange = e => {
    setCsvFile(e.target.files[0]);
  };

  const handleCsvUpload = async () => {
    if (!csvFile) return;
    const data = new FormData();
    data.append('file', csvFile);
    try {
      const res = await fetch('/api/admin/products/csv', {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        setMessage('Productos agregados desde CSV');
        onProductAdded && onProductAdded();
      } else {
        setMessage('Error al procesar CSV');
      }
    } catch {
      setMessage('Error de conexión');
    }
  };

  return (
    <Box p={6} bg="white" borderRadius={8} boxShadow="md" maxW={600} mx="auto" mt={8}>
      <Heading size="md" mb={4}>Agregar producto individual</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={3}>
          <FormLabel>Nombre</FormLabel>
          <Input name="name" value={form.name} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Precio base</FormLabel>
          <Input name="basePrice" type="number" value={form.basePrice} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Porcentaje de ganancia</FormLabel>
          <Input name="percentage" type="number" value={form.percentage} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Descripción</FormLabel>
          <Textarea name="description" value={form.description} onChange={handleChange} />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Stock</FormLabel>
          <Input name="stock" type="number" value={form.stock} onChange={handleChange} required />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Fotos (URLs separadas por coma)</FormLabel>
          <Input name="photos" value={form.photos} onChange={handleChange} />
        </FormControl>
        <Button type="submit" colorScheme="green" w="100%">Agregar producto</Button>
      </form>
      <Heading size="md" mt={8} mb={4}>Agregar productos por CSV</Heading>
      <FormControl mb={3}>
        <FormLabel>Archivo CSV</FormLabel>
        <Input type="file" accept=".csv" onChange={handleCsvChange} />
      </FormControl>
      <Button colorScheme="blue" w="100%" onClick={handleCsvUpload}>Subir CSV</Button>
      {message && <p style={{ marginTop: 16, color: '#e67e22' }}>{message}</p>}
    </Box>
  );
};

export default AdminAddProduct;
