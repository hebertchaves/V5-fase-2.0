// src/components/display/table-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps, findChildrenByTagName } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

// Interface para cabeçalhos da tabela
interface TableHeader {
  name: string;
  field: string;
}

// Interface para dados de linha
interface TableRow {
  [key: string]: any;
}

export async function processTableComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const tableFrame = figma.createFrame();
  tableFrame.name = "q-table";
  
  // Configuração básica de layout
  tableFrame.layoutMode = "VERTICAL";
  tableFrame.primaryAxisSizingMode = "AUTO";
  tableFrame.counterAxisSizingMode = "FIXED";
  tableFrame.resize(600, tableFrame.height);
  
  // Estilos de tabela
  tableFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  tableFrame.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  tableFrame.strokeWeight = 1;
  
  // Extrair propriedades
  const { props, styles } = extractStylesAndProps(node);
  
  // Definir cabeçalhos da tabela
  const headers: TableHeader[] = props.columns 
    ? JSON.parse(props.columns)
    : [
        { name: 'ID', field: 'id' },
        { name: 'Nome', field: 'name' },
        { name: 'Email', field: 'email' }
      ];
  
  // Definir dados da tabela
  const rowsData: TableRow[] = props.rows 
    ? JSON.parse(props.rows)
    : [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ];
  
  // Criar cabeçalhos
  const headerFrame = await createTableHeader(headers, settings);
  tableFrame.appendChild(headerFrame);
  
  // Criar linhas
  const rowsFrame = await createTableRows(headers, rowsData, settings);
  tableFrame.appendChild(rowsFrame);
  
  return tableFrame;
}

async function createTableHeader(headers: TableHeader[], settings: PluginSettings): Promise<FrameNode> {
  const headerFrame = figma.createFrame();
  headerFrame.name = "q-table-header";
  headerFrame.layoutMode = "HORIZONTAL";
  headerFrame.primaryAxisSizingMode = "AUTO";
  headerFrame.counterAxisSizingMode = "AUTO";
  headerFrame.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }];
  headerFrame.paddingLeft = 8;
  headerFrame.paddingRight = 8;
  headerFrame.paddingTop = 12;
  headerFrame.paddingBottom = 12;
  headerFrame.itemSpacing = 16;
  
  for (const header of headers) {
    const headerCell = figma.createFrame();
    headerCell.name = `header-${header.field}`;
    headerCell.layoutMode = "HORIZONTAL";
    headerCell.primaryAxisSizingMode = "AUTO";
    headerCell.counterAxisSizingMode = "AUTO";
    headerCell.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
    
    const headerText = await createText(header.name, {
      fontSize: 14,
      fontWeight: 'bold',
      color: { r: 0.2, g: 0.2, b: 0.2 }
    });
    
    if (headerText) {
      headerCell.appendChild(headerText);
      headerFrame.appendChild(headerCell);
    }
  }
  
  return headerFrame;
}

async function createTableRows(headers: TableHeader[], rows: TableRow[], settings: PluginSettings): Promise<FrameNode> {
  const rowsFrame = figma.createFrame();
  rowsFrame.name = "q-table-rows";
  rowsFrame.layoutMode = "VERTICAL";
  rowsFrame.primaryAxisSizingMode = "AUTO";
  rowsFrame.counterAxisSizingMode = "AUTO";
  rowsFrame.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
  rowsFrame.itemSpacing = 0;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowFrame = figma.createFrame();
    rowFrame.name = `row-${i+1}`;
    rowFrame.layoutMode = "HORIZONTAL";
    rowFrame.primaryAxisSizingMode = "AUTO";
    rowFrame.counterAxisSizingMode = "AUTO";
    rowFrame.paddingLeft = 8;
    rowFrame.paddingRight = 8;
    rowFrame.paddingTop = 12;
    rowFrame.paddingBottom = 12;
    rowFrame.itemSpacing = 16;
    
    // Alternar cor de fundo para linhas
    rowFrame.fills = [{ 
      type: 'SOLID', 
      color: { r: 1, g: 1, b: 1 },
      opacity: i % 2 === 0 ? 1 : 0.95
    }];
    
    // Adicionar borda inferior
    rowFrame.strokes = [{ type: 'SOLID', color: { r: 0.93, g: 0.93, b: 0.93 } }];
    rowFrame.strokeBottomWeight = 1;
    rowFrame.strokeTopWeight = 0;
    rowFrame.strokeLeftWeight = 0;
    rowFrame.strokeRightWeight = 0;
    
    for (const header of headers) {
      const cellFrame = figma.createFrame();
      cellFrame.name = `cell-${header.field}`;
      cellFrame.layoutMode = "HORIZONTAL";
      cellFrame.primaryAxisSizingMode = "AUTO";
      cellFrame.counterAxisSizingMode = "AUTO";
      cellFrame.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
      
      const cellValue = row[header.field] !== undefined ? String(row[header.field]) : '';
      const cellText = await createText(cellValue, {
        fontSize: 14,
        color: { r: 0.2, g: 0.2, b: 0.2 }
      });
      
      if (cellText) {
        cellFrame.appendChild(cellText);
        rowFrame.appendChild(cellFrame);
      }
    }
    
    rowsFrame.appendChild(rowFrame);
  }
  
  return rowsFrame;
}