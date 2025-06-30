"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface PlanSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  includeSummer: boolean;
  onChangeIncludeSummer: (value: boolean) => void;
}

export function PlanSettingsDialog({
  open,
  onOpenChange,
  includeSummer,
  onChangeIncludeSummer,
}: PlanSettingsDialogProps) {
  const [tempIncludeSummer, setTempIncludeSummer] = useState(includeSummer);

  useEffect(() => {
    if (open) {
      setTempIncludeSummer(includeSummer);
    }
  }, [open, includeSummer]);

  const applyChanges = () => {
    onChangeIncludeSummer(tempIncludeSummer);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Plan Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Include Summer Quarters</p>
              <p className="text-sm text-muted-foreground max-w-[280px]">
                Allow scheduling courses in Summer terms.
              </p>
            </div>
            <Switch
              checked={tempIncludeSummer}
              onCheckedChange={setTempIncludeSummer}
            />
          </div>
        </div>
        <div className="pt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={applyChanges}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
