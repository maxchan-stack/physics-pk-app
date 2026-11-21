import React from 'react';
import { DiagramType } from '../types/physics-types';
import { Grade10DiagramType, renderGrade10BlackboardSvg } from './BlackboardGrade10Svg';
import { Grade11DiagramType, renderGrade11BlackboardSvg } from './BlackboardGrade11Svg';
import { Grade12DiagramType, renderGrade12BlackboardSvg } from './BlackboardGrade12Svg';

interface BlackboardDiagramProps {
  /** 黑板圖解類型（34 堂課 1 對 1 專屬類型） */
  diagramType: DiagramType;
  /** 黑板底部說明文字 */
  caption: string;
}

const GRADE10_TYPES = new Set<DiagramType>([
  'quark_four_forces',
  'g10_newton_inertia',
  'kepler_laws',
  'oersted_right_hand',
  'em_induction_spectrum',
  'photoelectric_quantum',
  'energy_mass_equivalence',
]);

const GRADE11_TYPES = new Set<DiagramType>([
  'si_dimensions',
  'uncertainty_ruler',
  'displacement_numberline',
  'uniform_accel_vt',
  'vertical_throw_symmetry',
  'horizontal_projectile',
  'projectile_parabola',
  'circular_shm_projection',
  'newton_force_block',
  'friction_elevator',
  'gravity_field_profile',
  'satellite_binary_energy',
  'impulse_momentum_cm',
  'vertical_circle_energy',
  'collision_1d',
  'kinetic_theory_gas',
  'thermo_pv_first_law',
]);

const GRADE12_TYPES = new Set<DiagramType>([
  'standing_wave_string',
  'wave_doppler',
  'optics_refract_lens',
  'double_slit_diffraction',
  'electrostatics_capacitor',
  'dc_circuit_bridge',
  'lorentz_cyclotron',
  'electromagnetic_induction',
  'bohr_energy_levels',
  'nuclear_binding_halflife',
]);

/**
 * 教室深綠木框黑板 SVG 圖解元件
 * 為高中三年段 34 堂觀念課提供 1 對 1 專屬物理黑板繪圖，確保每個觀念擁有獨立且精確的圖解內容。
 *
 * @param props BlackboardDiagramProps
 * @returns 黑板視覺圖解元件
 */
export function BlackboardDiagram({
  diagramType,
  caption,
}: BlackboardDiagramProps): React.ReactElement {
  /**
   * 根據圖解類型分派至對應年段黑板 SVG 繪圖，並以 never 窮盡檢查確保無遺漏型別
   */
  const renderSvgContent = (): React.ReactElement => {
    if (GRADE10_TYPES.has(diagramType)) {
      return renderGrade10BlackboardSvg(diagramType as Grade10DiagramType);
    }
    if (GRADE11_TYPES.has(diagramType)) {
      return renderGrade11BlackboardSvg(diagramType as Grade11DiagramType);
    }
    if (GRADE12_TYPES.has(diagramType)) {
      return renderGrade12BlackboardSvg(diagramType as Grade12DiagramType);
    }

    // TypeScript 編譯期窮盡防呆檢查：確認 switch / Set 涵蓋所有 DiagramType
    const exhaustiveFallback = (value: never): React.ReactElement => {
      return <div className="text-white text-xs">{String(value)}</div>;
    };

    switch (diagramType) {
      case 'quark_four_forces':
      case 'g10_newton_inertia':
      case 'kepler_laws':
      case 'oersted_right_hand':
      case 'em_induction_spectrum':
      case 'photoelectric_quantum':
      case 'energy_mass_equivalence':
        return renderGrade10BlackboardSvg(diagramType);
      case 'si_dimensions':
      case 'uncertainty_ruler':
      case 'displacement_numberline':
      case 'uniform_accel_vt':
      case 'vertical_throw_symmetry':
      case 'horizontal_projectile':
      case 'projectile_parabola':
      case 'circular_shm_projection':
      case 'newton_force_block':
      case 'friction_elevator':
      case 'gravity_field_profile':
      case 'satellite_binary_energy':
      case 'impulse_momentum_cm':
      case 'vertical_circle_energy':
      case 'collision_1d':
      case 'kinetic_theory_gas':
      case 'thermo_pv_first_law':
        return renderGrade11BlackboardSvg(diagramType);
      case 'standing_wave_string':
      case 'wave_doppler':
      case 'optics_refract_lens':
      case 'double_slit_diffraction':
      case 'electrostatics_capacitor':
      case 'dc_circuit_bridge':
      case 'lorentz_cyclotron':
      case 'electromagnetic_induction':
      case 'bohr_energy_levels':
      case 'nuclear_binding_halflife':
        return renderGrade12BlackboardSvg(diagramType);
      default:
        return exhaustiveFallback(diagramType);
    }
  };

  return (
    <div className="rounded-lg border-[6px] border-[#69513b] bg-[#233b30] px-4 py-3.5 shadow-inner">
      {renderSvgContent()}
      <p className="mt-2 border-t border-[#3b5c4d] pt-2.5 text-[15px] leading-relaxed text-[#e6f0ec] tracking-wide">
        {caption}
      </p>
    </div>
  );
}
