import { useFallbackTranslation } from '@/hooks/useFallbackTranslation';
import Button, { ButtonVariant } from '@/shared/components/button/Button';

interface Props {
  onClear: () => void;
}

const FiltersPanelHeader = ({ onClear }: Props) => {
  const { t } = useFallbackTranslation();

  return (
    <div className="filters-panel__header">
      <h3 id="filters-panel-heading"> {t('common.filtersPanel.filters')}</h3>
      <Button
        className="clear-btn"
        aria-label="Clear Button"
        data-testid="clear-btn"
        variant={ButtonVariant.SECONDARY}
        size="xs"
        handleClick={onClear}
      >
        {t('common.buttons.clearFilters')}
      </Button>
    </div>
  );
};

export default FiltersPanelHeader;
