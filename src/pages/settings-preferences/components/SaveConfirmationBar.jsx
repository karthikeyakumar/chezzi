import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SaveConfirmationBar = ({ hasChanges, onSave, onReset, onCancel, isSaving = false }) => {
  if (!hasChanges) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-prominent">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-warning/20 rounded-full">
              <Icon name="AlertCircle" size={16} className="text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-card-foreground">
                You have unsaved changes
              </p>
              <p className="text-xs text-muted-foreground">
                Save your preferences to apply the changes
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={isSaving}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={onSave}
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveConfirmationBar;