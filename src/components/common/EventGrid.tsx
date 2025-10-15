import React from "react";
import sofa from '../../assets/simbolos/sofa.png';
import cerveza from '../../assets/simbolos/cerveza.png';
import comida from '../../assets/simbolos/comida.png';
import fuego from '../../assets/simbolos/fuego.png';
import juegos from '../../assets/simbolos/juego.png';
import musica from '../../assets/simbolos/musica.png';
import te from '../../assets/simbolos/te.png';
import torta from '../../assets/simbolos/torta.png';
import whisky from '../../assets/simbolos/whisky.png';
import type { Event, Product } from '../../types/types';

interface EventGridProps {
  events: Event[];
}

// Mapeo de productos a símbolos
const symbolMap: Record<Product, string> = {
  cerveza, comida, fuego, juegos, musica, sofa, te, torta, whisky
};

// Estructura de la grilla: [rowLabel, [col1Product, col2Product, col3Product]]
const gridStructure: [string, [Product, Product, Product]][] = [
  ['A', ['cerveza', 'comida', 'fuego']],
  ['T', ['sofa', 'torta', 'te']],
  ['F', ['juegos', 'whisky', 'musica']]
];

const columnLabels = ['J', 'C', 'R'];

// Clases reutilizables
const cell = "flex flex-col";
const labelTop = "absolute right-0 top-0 transform translate-x-1/2 text-white";
const labelLeft = "absolute bottom-0 left-0 transform translate-y-1/2 text-white";
const icon = "absolute right-0 bottom-0 transform translate-x-1/2 translate-y-1/2 w-[25px] h-[25px]";

// Componentes auxiliares
const Cell = ({ w, h, border, opacity, children }: { 
  w: string; 
  h: string; 
  border?: string; 
  opacity?: number;
  children?: React.ReactNode 
}) => (
  <div 
    className={`${cell} ${w} ${h} ${border || ""} ${children ? "relative" : ""}`}
    style={border && opacity !== undefined ? { borderColor: `rgba(255, 255, 255, ${opacity})` } : undefined}
  >
    {children}
  </div>
);

const TopLabel = ({ char, active }: { char: string; active: boolean }) => (
  <span className={labelTop} style={{ opacity: active ? 1 : 0.5 }}>{char}</span>
);

const LeftLabel = ({ char, active }: { char: string; active: boolean }) => (
  <span className={labelLeft} style={{ opacity: active ? 1 : 0.5 }}>{char}</span>
);

const Icon = ({ src, alt, active }: { src: string; alt: string; active: boolean }) => (
  <img src={src} alt={alt} className={icon} style={{ opacity: active ? 1 : 0.5 }} />
);

const EventGrid = ({ events }: EventGridProps) => {
  // Función para verificar si un producto está activo horizontalmente
  const isProductActiveHorizontal = (product: Product, rowLabel: string): boolean => {
    return events.some(event => 
      event.completed && 
      event.initial === rowLabel && 
      event.requirements.includes(product)
    );
  };

  // Función para verificar si un producto está activo verticalmente
  const isProductActiveVertical = (product: Product, colIndex: number): boolean => {
    const columnLabel = columnLabels[colIndex];
    return events.some(event => {
      if (!event.completed || event.initial !== columnLabel) return false;
      
      // Obtener los productos de esta columna en todas las filas
      const columnProducts = gridStructure.map(([_, products]) => products[colIndex]);
      return event.requirements.includes(product) && columnProducts.includes(product);
    });
  };

  // Función para verificar si una etiqueta de fila está activa
  const isRowLabelActive = (rowLabel: string): boolean => {
    return events.some(event => event.completed && event.initial === rowLabel);
  };

  // Función para verificar si una etiqueta de columna está activa
  const isColumnLabelActive = (colIndex: number): boolean => {
    const columnLabel = columnLabels[colIndex];
    return events.some(event => event.completed && event.initial === columnLabel);
  };

  // Dimensiones de celdas por fila
  const rowHeights = ['h-[30px]', 'h-[40px]', 'h-[40px]'];
  const colWidths = ['w-[30px]', 'w-[40px]', 'w-[40px]'];

  return (
    <div className="flex flex-col opacity-80">
      {/* Header row */}
      <div className="flex flex-row gap-0">
        <Cell w="w-[20px]" h="h-[30px]" />
        {columnLabels.map((label, idx) => (
          <Cell key={label} w={colWidths[idx]} h="h-[30px]">
            <TopLabel char={label} active={isColumnLabelActive(idx)} />
          </Cell>
        ))}
        <Cell w="w-[30px]" h="h-[30px]" />
      </div>

      {/* Data rows */}
      {gridStructure.map(([rowLabel, products], rowIdx) => (
        <div key={rowLabel} className="flex flex-row gap-0">
          <Cell w="w-[20px]" h={rowHeights[rowIdx]}>
            <LeftLabel char={rowLabel} active={isRowLabelActive(rowLabel)} />
          </Cell>
          {products.map((product, colIdx) => {
            const isHorizontalActive = isProductActiveHorizontal(product, rowLabel);
            const isVerticalActive = isProductActiveVertical(product, colIdx);
            const isActive = isHorizontalActive || isVerticalActive;
            
            // Opacidad separada para cada borde
            const bottomOpacity = isHorizontalActive ? 1 : 0;
            const rightOpacity = isVerticalActive ? 1 : 0;
            
            return (
              <div 
                key={product}
                className={`${cell} ${colWidths[colIdx]} ${rowHeights[rowIdx]} border-b border-r relative`}
                style={{
                  borderBottomColor: `rgba(255, 255, 255, ${bottomOpacity})`,
                  borderRightColor: `rgba(255, 255, 255, ${rightOpacity})`
                }}
              >
                <Icon src={symbolMap[product]} alt={product} active={isActive} />
              </div>
            );
          })}
          <Cell 
            w="w-[30px]" 
            h={rowHeights[rowIdx]} 
            border="border-b"
            opacity={isRowLabelActive(rowLabel) ? 1 : 0}
          />
        </div>
      ))}

      {/* Footer row */}
      <div className="flex flex-row gap-0">
        <Cell w="w-[20px]" h="h-[30px]" />
        {colWidths.map((width, idx) => {
          const isActive = isColumnLabelActive(idx);
          const borderOpacity = isActive ? 1 : 0;
          return (
            <Cell 
              key={idx} 
              w={width} 
              h="h-[30px]" 
              border="border-r"
              opacity={borderOpacity}
            />
          );
        })}
        <Cell w="w-[40px]" h="h-[30px]" />
      </div>
    </div>
  );
};

export default EventGrid;
