import React from 'react';
import { motion } from 'framer-motion';
import { Document } from 'react-pdf';
import { useDropzone } from 'react-dropzone';

const DependencyTest = () => {
  const { getRootProps, getInputProps } = useDropzone();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dependency-test"
    >
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Dropzone and motion components working</p>
      </div>
      <Document />
    </motion.div>
  );
};

export default DependencyTest;