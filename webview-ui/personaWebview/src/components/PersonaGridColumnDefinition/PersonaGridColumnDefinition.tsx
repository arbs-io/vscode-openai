import {
  TableCellLayout,
  TableColumnDefinition,
  createTableColumn,
  Persona,
  TableCell,
} from '@fluentui/react-components'
import IPersonaOpenAI from 'interfaces/IPersonaOpenAI'

const PersonaGridColumnDefinition: TableColumnDefinition<IPersonaOpenAI>[] = [
  createTableColumn<IPersonaOpenAI>({
    columnId: 'persona',
    compare: (source, target) => {
      return source.roleName.localeCompare(target.roleName)
    },
    renderHeaderCell: () => {
      return 'Persona'
    },
    renderCell: (item) => {
      const overview = `${item.configuration.service} (${item.configuration.model})`
      return (
        <div id="personadiv">
          <TableCell tabIndex={0} role="gridcell">
            <TableCellLayout
              media={
                <Persona
                  presence={{ status: 'available' }}
                  size="medium"
                  name={item.roleName}
                  tertiaryText={`${item.configuration.service} (${item.configuration.model})`}
                  avatar={{ color: 'colorful' }}
                />
              }
            />
          </TableCell>
        </div>
      )
    },
  }),
]

export default PersonaGridColumnDefinition
