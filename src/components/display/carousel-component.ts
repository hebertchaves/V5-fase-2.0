// src/components/display/carousel-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps, findChildrenByTagName } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText, createShadowEffect, setNodeSize } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

/**
 * Processa um componente de carrossel Quasar (q-carousel)
 */
export async function processCarouselComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const carouselFrame = figma.createFrame();
  carouselFrame.name = "q-carousel";
  
  // Configuração básica
  carouselFrame.layoutMode = "VERTICAL";
  carouselFrame.primaryAxisSizingMode = "AUTO";
  carouselFrame.counterAxisSizingMode = "FIXED";
  carouselFrame.resize(400, carouselFrame.height);
  carouselFrame.cornerRadius = 4;
  carouselFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Determinar cor do carrossel se especificada
  if (props.color && quasarColors[props.color] && settings.preserveQuasarColors) {
    carouselFrame.fills = [{ type: 'SOLID', color: quasarColors[props.color] }];
  }
  
  // Configurações adicionais
  const showArrows = props.arrows === 'true' || props.arrows === '';
  const showNavigation = props.navigation === 'true' || props.navigation === '';
  
  // Processar slides
  const slideNodes = findChildrenByTagName(node, 'q-carousel-slide');
  let activeSlideIndex = 0;  // Por padrão, o primeiro slide é ativo
  
  // Se não houver slides, criar alguns de exemplo
  if (slideNodes.length === 0) {
    // Container do slide (apenas um mostrado por vez)
    const slideContainer = figma.createFrame();
    slideContainer.name = "q-carousel__slides";
    slideContainer.layoutMode = "HORIZONTAL";
    slideContainer.primaryAxisSizingMode = "FIXED";
    slideContainer.counterAxisSizingMode = "FIXED";
    setNodeSize(slideContainer, 400, 250);
    slideContainer.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    
    // Exemplo de conteúdo do slide
    const slideContent = figma.createFrame();
    slideContent.name = "q-carousel-slide__content";
    slideContent.layoutMode = "VERTICAL";
    slideContent.primaryAxisSizingMode = "FIXED";
    slideContent.counterAxisSizingMode = "FIXED";
    setNodeSize(slideContent, 400, 250);
    slideContent.primaryAxisAlignItems = "CENTER";
    slideContent.counterAxisAlignItems = "CENTER";
    slideContent.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
    
    const slideText = await createText("Slide 1", {
      fontSize: 24,
      fontWeight: 'bold'
    });
    
    slideContent.appendChild(slideText);
    slideContainer.appendChild(slideContent);
    carouselFrame.appendChild(slideContainer);
  } else {
    // Encontrar slide ativo
    for (let i = 0; i < slideNodes.length; i++) {
      const slideProps = extractStylesAndProps(slideNodes[i]).props;
      if (slideProps.active === 'true' || slideProps.active === '') {
        activeSlideIndex = i;
        break;
      }
    }
    
    // Container do slide (apenas um mostrado por vez)
    const slideContainer = figma.createFrame();
    slideContainer.name = "q-carousel__slides";
    slideContainer.layoutMode = "HORIZONTAL";
    slideContainer.primaryAxisSizingMode = "FIXED";
    slideContainer.counterAxisSizingMode = "FIXED";
    setNodeSize(slideContainer, 400, 250);
    slideContainer.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    
    // Mostrar slide ativo
    const activeSlide = slideNodes[activeSlideIndex];
    const slideProps = extractStylesAndProps(activeSlide).props;
    
    // Processar conteúdo do slide
    const slideContent = figma.createFrame();
    slideContent.name = `q-carousel-slide-${activeSlideIndex + 1}`;
    slideContent.layoutMode = "VERTICAL";
    slideContent.primaryAxisSizingMode = "FIXED";
    slideContent.counterAxisSizingMode = "FIXED";
    setNodeSize(slideContent, 400, 250);
    slideContent.primaryAxisAlignItems = "CENTER";
    slideContent.counterAxisAlignItems = "CENTER";
    slideContent.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
    
    // Tentar extrair texto ou nome do slide
    let slideName = slideProps.name || `Slide ${activeSlideIndex + 1}`;
    
    // Tentar extrair texto dos filhos
    let slideText = "";
    for (const child of activeSlide.childNodes) {
      if (child.text) {
        slideText += child.text.trim() + " ";
      }
    }
    
    slideText = slideText.trim() || slideName;
    
    const slideTextNode = await createText(slideText, {
      fontSize: 24,
      fontWeight: 'bold'
    });
    
    slideContent.appendChild(slideTextNode);
    slideContainer.appendChild(slideContent);
    carouselFrame.appendChild(slideContainer);
  }
  
  // Adicionar controles de navegação
  if (showArrows) {
    const arrowsContainer = figma.createFrame();
    arrowsContainer.name = "q-carousel__arrows";
    arrowsContainer.layoutMode = "HORIZONTAL";
    arrowsContainer.primaryAxisSizingMode = "AUTO";
    arrowsContainer.counterAxisSizingMode = "FIXED";
    arrowsContainer.resize(arrowsContainer.width, 40);
    arrowsContainer.primaryAxisAlignItems = "SPACE_BETWEEN";
    arrowsContainer.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
    
    // Seta esquerda
    const leftArrow = figma.createFrame();
    leftArrow.name = "q-carousel__arrow-left";
    leftArrow.resize(40, 40);
    leftArrow.cornerRadius = 20;
    leftArrow.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.3 }];
    
    const leftIcon = await createText("<", {
      fontSize: 16,
      color: { r: 1, g: 1, b: 1 },
      alignment: 'CENTER',
      verticalAlignment: 'CENTER'
    });
    
    leftArrow.appendChild(leftIcon);
    
    // Seta direita
    const rightArrow = figma.createFrame();
    rightArrow.name = "q-carousel__arrow-right";
    rightArrow.resize(40, 40);
    rightArrow.cornerRadius = 20;
    rightArrow.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.3 }];
    
    const rightIcon = await createText(">", {
      fontSize: 16,
      color: { r: 1, g: 1, b: 1 },
      alignment: 'CENTER',
      verticalAlignment: 'CENTER'
    });
    
    rightArrow.appendChild(rightIcon);
    
    arrowsContainer.appendChild(leftArrow);
    arrowsContainer.appendChild(rightArrow);
    
    carouselFrame.appendChild(arrowsContainer);
  }
  
  // Adicionar navegação
  if (showNavigation) {
    const dotsContainer = figma.createFrame();
    dotsContainer.name = "q-carousel__navigation";
    dotsContainer.layoutMode = "HORIZONTAL";
    dotsContainer.primaryAxisSizingMode = "AUTO";
    dotsContainer.counterAxisSizingMode = "AUTO";
    dotsContainer.primaryAxisAlignItems = "CENTER";
    dotsContainer.paddingTop = 8;
    dotsContainer.paddingBottom = 8;
    dotsContainer.itemSpacing = 8;
    dotsContainer.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
    
    // Quantidade de dots
    const numDots = slideNodes.length > 0 ? slideNodes.length : 3;
    
    // Criar dots
    for (let i = 0; i < numDots; i++) {
      const dot = figma.createEllipse();
      dot.name = `q-carousel__dot-${i+1}`;
      dot.resize(8, 8);
      
      // Dot ativo
      if (i === activeSlideIndex) {
        const dotColor = props.color && quasarColors[props.color] && settings.preserveQuasarColors
          ? quasarColors[props.color]
          : { r: 0.1, g: 0.5, b: 0.9 };  // Cor padrão
          
        dot.fills = [{ type: 'SOLID', color: dotColor }];
      } else {
        dot.fills = [{ type: 'SOLID', color: { r: 0.7, g: 0.7, b: 0.7 } }];
      }
      
      dotsContainer.appendChild(dot);
    }
    
    carouselFrame.appendChild(dotsContainer);
  }
  
  return carouselFrame;
}