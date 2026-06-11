import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      ...S.documentTypeListItems().filter(
        (listItem) =>
          // Hides the individual section blocks so they don't clutter your sidebar
          !['heroBlock', 'productGridBlock', 'textContentBlock'].includes(listItem.getId() || '')
      ),
    ])