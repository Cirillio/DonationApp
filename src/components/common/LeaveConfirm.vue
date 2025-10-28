<template>
  <Dialog :open="open" @update:open="onClose">
    <DialogOverlay class="backdrop-blur-md bg-black/35" />
    <DialogContent @escape-key-down="onCancel" class="sm:max-w-md shadow-sm border-0">
      <DialogHeader class="text-center space-y-4">
        <div class="mx-auto w-fit relative">
          <div class="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <span class="iconify f7--doc-text size-8 text-destructive"></span>
          </div>
          <span
            class="absolute -top-1 -right-1 iconify f7--exclamationmark-circle-fill size-6 text-destructive rounded-full"
          ></span>
        </div>

        <div class="space-y-2">
          <DialogTitle class="text-xl">{{ title }}</DialogTitle>
          <DialogDescription class="text-muted-foreground">
            {{ description }}
          </DialogDescription>
        </div>
      </DialogHeader>

      <DialogFooter class="flex-col-reverse sm:flex-row gap-2 mt-6">
        <Button @click="onCancel" class="w-full sm:flex-1"> Остаться </Button>
        <Button
          variant="outline"
          @click="onConfirm"
          class="w-full border-destructive text-destructive hover:text-destructive bg-destructive/10 hover:bg-destructive/20 sm:flex-1"
        >
          Выйти
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import DialogOverlay from '../ui/dialog/DialogOverlay.vue'

defineProps<{
  open: boolean
  onClose: () => void
  onConfirm: () => void
  onCancel: () => void
  title: string
  description: string
}>()
</script>

<style></style>
