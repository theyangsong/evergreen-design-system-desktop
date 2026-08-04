import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue';
import {
  isFlotationBoxSceneAddressKind,
  parseFlotationMaxHeight,
  parseFlotationMenuWidth,
} from './flotationDocCustomize';
import {
  parseSceneAddressMaxHeight,
  parseSceneAddressMaxWidth,
} from './flotationBoxSceneAddressCustomize';

/** `/components/flotation-box` — EgFlotationMenu 外壳 props（库做壳，Showcase 场景 SFC 做内容）。 */
export function resolveFlotationBoxMenuShellProps(customize: Record<string, unknown>): {
  menuClass: string;
  widthMode: 'fixed' | 'adaptive';
  width: number | undefined;
  maxWidth: number | undefined;
  maxHeight: number | undefined;
  showAdd: boolean;
  listScroll: boolean;
} {
  const isScene = isFlotationBoxSceneAddressKind(customize);
  const menuWidth = isScene ? undefined : parseFlotationMenuWidth(customize);
  const menuClasses = ['eds-flotation-menu--box-doc'];
  if (isScene) menuClasses.push('eds-flotation-menu--scene-address');

  return {
    menuClass: menuClasses.join(' '),
    widthMode: isScene ? 'adaptive' : menuWidth != null ? 'fixed' : 'adaptive',
    width: menuWidth,
    maxWidth: isScene ? parseSceneAddressMaxWidth(customize) : undefined,
    maxHeight: isScene
      ? parseSceneAddressMaxHeight(customize)
      : parseFlotationMaxHeight(customize),
    showAdd: isScene ? false : Boolean(customize.showAdd),
    listScroll: isScene,
  };
}

export type FlotationBoxMenuShellProps = ReturnType<typeof resolveFlotationBoxMenuShellProps>;

export function useFlotationBoxMenuShellProps(
  customize: MaybeRefOrGetter<Record<string, unknown>>,
): ComputedRef<FlotationBoxMenuShellProps> {
  return computed(() => resolveFlotationBoxMenuShellProps(toValue(customize)));
}
