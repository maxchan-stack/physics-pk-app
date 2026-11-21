import React from 'react';

interface MathTextProps {
  /** 要渲染的題幹或物理算式字串 */
  text: string;
  /** 額外的樣式類別 */
  className?: string;
}

/**
 * 進階物理算式與科學符號結構化渲染元件
 * NOTE: 嚴格遵守前端安全規範（禁止使用 dangerouslySetInnerHTML），
 * 採用純 React 語法解析器將複合上下標（如 v_0^2、10^-15、E_k(max)、r_近）、
 * 根號 √(...) 與常用分式轉為教科書級別之 React 數學排版節點。
 *
 * @param props MathTextProps
 * @returns React 節點
 */
export function MathText({ text, className = '' }: MathTextProps): React.ReactElement {
  // 先將常見純文字分數與平方符號標準化，方便統一解析
  const normalized = text
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/⁻¹/g, '^-1')
    .replace(/⁻²/g, '^-2')
    .replace(/⁻³/g, '^-3')
    .replace(/₀/g, '_0')
    .replace(/₁/g, '_1')
    .replace(/₂/g, '_2')
    .replace(/₃/g, '_3')
    .replace(/₄/g, '_4');

  // 匹配：1. 根號 √(...) (支援一層巢狀括號)、√[...] 或 √x  2. 複合上下標 base_sub^sup  3. 純上標 base^sup  4. 純下標 base_sub
  const pattern =
    /(√\[[^\]]+\]|√\((?:[^()]+|\([^()]*\))+\)|√[a-zA-Z0-9_+\u4e00-\u9fa5]+|[a-zA-Z0-9α-ωΑ-Ω']+(?:_[a-zA-Z0-9()+\-/\u4e00-\u9fa5]+)?\^(?:\([^)]+\)|[a-zA-Z0-9+\-/]+)|[a-zA-Zα-ωΑ-Ω']+(?:_[a-zA-Z0-9()+\-/\u4e00-\u9fa5]+))/g;

  const parts = normalized.split(pattern);

  /**
   * 遞迴渲染根號內部或上下標文字
   */
  const renderSubToken = (token: string, keyPrefix: string): React.ReactNode => {
    // 處理複合上下標或單純上下標，例如 v_0^2, 10^-15, E_k(max), r_近
    const caretIdx = token.indexOf('^');
    const underIdx = token.indexOf('_');

    if (caretIdx > 0 && underIdx > 0 && underIdx < caretIdx) {
      const base = token.slice(0, underIdx);
      const sub = token.slice(underIdx + 1, caretIdx);
      const sup = token.slice(caretIdx + 1).replace(/^\(|\)$/g, '');
      return (
        <span key={keyPrefix} className="inline-flex items-baseline">
          <span className="font-serif italic">{base}</span>
          <sub className="text-[0.72em] font-sans not-italic leading-none ml-[0.5px]">
            {sub}
          </sub>
          <sup className="text-[0.72em] font-semibold leading-none ml-[0.5px]">
            {sup}
          </sup>
        </span>
      );
    }

    if (caretIdx > 0) {
      const base = token.slice(0, caretIdx);
      const sup = token.slice(caretIdx + 1).replace(/^\(|\)$/g, '');
      const isNumericBase = /^[0-9]+$/.test(base);
      return (
        <span key={keyPrefix} className="inline-flex items-baseline">
          <span className={isNumericBase ? 'font-sans' : 'font-serif italic'}>
            {base}
          </span>
          <sup className="text-[0.74em] font-semibold leading-none ml-[0.5px]">
            {sup}
          </sup>
        </span>
      );
    }

    if (underIdx > 0) {
      const base = token.slice(0, underIdx);
      const sub = token.slice(underIdx + 1);
      return (
        <span key={keyPrefix} className="inline-flex items-baseline">
          <span className="font-serif italic">{base}</span>
          <sub className="text-[0.72em] font-sans not-italic leading-none ml-[0.5px]">
            {sub}
          </sub>
        </span>
      );
    }

    return token;
  };

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (!part) {
          return null;
        }

        // 處理根號 √(...) 或 √[...] 或 √x
        if (part.startsWith('√')) {
          const innerRaw = part.slice(1);
          const innerClean = innerRaw.replace(/^(\(|\[)|(\)|\])$/g, '');
          return (
            <span
              key={`sqrt-${idx}`}
              className="inline-flex items-baseline mx-[1px]"
            >
              <span className="font-serif text-[1.05em] leading-none mr-[0.5px]">
                √
              </span>
              <span className="border-t border-current px-[2px] pt-[1px] leading-tight">
                {renderSubToken(innerClean, `sqrt-in-${idx}`)}
              </span>
            </span>
          );
        }

        if (part.includes('^') || part.includes('_')) {
          return renderSubToken(part, `tok-${idx}`);
        }

        return <React.Fragment key={`txt-${idx}`}>{part}</React.Fragment>;
      })}
    </span>
  );
}
