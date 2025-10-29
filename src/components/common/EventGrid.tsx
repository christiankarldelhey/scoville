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
  suggestions?: Event[] | null;
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

const TopLabel = ({ char, active, suggested }: { char: string; active: boolean; suggested?: boolean }) => (
  <span 
    className={`${labelTop} ${suggested && !active ? 'animate-pulse-glow' : ''}`} 
    style={{ opacity: active ? 1 : suggested ? 0.8 : 0.5 }}
  >
    {char}
  </span>
);

const LeftLabel = ({ char, active, suggested }: { char: string; active: boolean; suggested?: boolean }) => (
  <span 
    className={`${labelLeft} ${suggested && !active ? 'animate-pulse-glow' : ''}`} 
    style={{ opacity: active ? 1 : suggested ? 0.8 : 0.5 }}
  >
    {char}
  </span>
);

const Icon = ({ src, alt, active, suggested }: { src: string; alt: string; active: boolean; suggested?: boolean }) => (
  <img 
    src={src} 
    alt={alt} 
    className={`${icon} ${suggested && !active ? 'animate-pulse-glow-icon' : ''}`} 
    style={{ opacity: active ? 1 : suggested ? 0.7 : 0.5 }} 
  />
);

const EventGrid = ({ events, suggestions }: EventGridProps) => {
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

  // Funciones para verificar sugerencias (eventos posibles pero no completados)
  const isProductSuggestedHorizontal = (product: Product, rowLabel: string): boolean => {
    return suggestions?.some(event => 
      event.initial === rowLabel && 
      event.requirements.includes(product)
    ) || false;
  };

  const isProductSuggestedVertical = (product: Product, colIndex: number): boolean => {
    const columnLabel = columnLabels[colIndex];
    return suggestions?.some(event => {
      if (event.initial !== columnLabel) return false;
      const columnProducts = gridStructure.map(([_, products]) => products[colIndex]);
      return event.requirements.includes(product) && columnProducts.includes(product);
    }) || false;
  };

  const isRowLabelSuggested = (rowLabel: string): boolean => {
    return suggestions?.some(event => event.initial === rowLabel) || false;
  };

  const isColumnLabelSuggested = (colIndex: number): boolean => {
    const columnLabel = columnLabels[colIndex];
    return suggestions?.some(event => event.initial === columnLabel) || false;
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
            <TopLabel 
              char={label} 
              active={isColumnLabelActive(idx)} 
              suggested={isColumnLabelSuggested(idx)}
            />
          </Cell>
        ))}
        <Cell w="w-[30px]" h="h-[30px]" />
      </div>

      {/* Data rows */}
      {gridStructure.map(([rowLabel, products], rowIdx) => (
        <div key={rowLabel} className="flex flex-row gap-0">
          <Cell w="w-[20px]" h={rowHeights[rowIdx]}>
            <LeftLabel 
              char={rowLabel} 
              active={isRowLabelActive(rowLabel)} 
              suggested={isRowLabelSuggested(rowLabel)}
            />
          </Cell>
          {products.map((product, colIdx) => {
            const isHorizontalActive = isProductActiveHorizontal(product, rowLabel);
            const isVerticalActive = isProductActiveVertical(product, colIdx);
            const isActive = isHorizontalActive || isVerticalActive;
            
            const isHorizontalSuggested = isProductSuggestedHorizontal(product, rowLabel);
            const isVerticalSuggested = isProductSuggestedVertical(product, colIdx);
            const isSuggested = isHorizontalSuggested || isVerticalSuggested;
            
            // Opacidad separada para cada borde
            const bottomOpacity = isHorizontalActive ? 1 : isHorizontalSuggested ? 0.6 : 0;
            const rightOpacity = isVerticalActive ? 1 : isVerticalSuggested ? 0.6 : 0;
            
            return (
              <div 
                key={product}
                className={`${cell} ${colWidths[colIdx]} ${rowHeights[rowIdx]} border-b border-r relative ${
                  isHorizontalSuggested && !isHorizontalActive ? 'animate-border-pulse-bottom' : ''
                } ${
                  isVerticalSuggested && !isVerticalActive ? 'animate-border-pulse-right' : ''
                }`}
                style={{
                  borderBottomColor: `rgba(255, 255, 255, ${bottomOpacity})`,
                  borderRightColor: `rgba(255, 255, 255, ${rightOpacity})`
                }}
              >
                <Icon 
                  src={symbolMap[product]} 
                  alt={product} 
                  active={isActive}
                  suggested={isSuggested}
                />
              </div>
            );
          })}
          <div 
            className={`${cell} w-[30px] ${rowHeights[rowIdx]} border-b ${
              isRowLabelSuggested(rowLabel) && !isRowLabelActive(rowLabel) ? 'animate-border-pulse-bottom' : ''
            }`}
            style={{
              borderBottomColor: `rgba(255, 255, 255, ${
                isRowLabelActive(rowLabel) ? 1 : isRowLabelSuggested(rowLabel) ? 0.6 : 0
              })`
            }}
          />
        </div>
      ))}

      {/* Footer row */}
      <div className="flex flex-row gap-0">
        <Cell w="w-[20px]" h="h-[30px]" />
        {colWidths.map((width, idx) => {
          const isActive = isColumnLabelActive(idx);
          const isSuggested = isColumnLabelSuggested(idx);
          const borderOpacity = isActive ? 1 : isSuggested ? 0.6 : 0;
          return (
            <div 
              key={idx} 
              className={`${cell} ${width} h-[30px] border-r ${
                isSuggested && !isActive ? 'animate-border-pulse-right' : ''
              }`}
              style={{
                borderRightColor: `rgba(255, 255, 255, ${borderOpacity})`
              }}
            />
          );
        })}
        <Cell w="w-[40px]" h="h-[30px]" />
      </div>
    </div>
  );
};

export default EventGrid;
