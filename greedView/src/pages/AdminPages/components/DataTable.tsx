import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
  };
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data found',
  pagination,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl overflow-hidden">
        <div className="p-8 flex items-center justify-center">
          <motion.div
            className="w-8 h-8 border-2 border-[#8b5cf6]/30 border-t-[#8b5cf6] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl overflow-hidden">
        <div className="p-8 text-center text-gray-500">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-[#2a2a3e] hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`text-gray-400 font-medium ${column.className || ''}`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <motion.tr
              key={keyExtractor(item)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="border-[#2a2a3e] hover:bg-white/5 transition-colors"
            >
              {columns.map((column) => (
                <TableCell key={column.key} className={`text-gray-300 ${column.className || ''}`}>
                  {column.render
                    ? column.render(item)
                    : (item as Record<string, unknown>)[column.key]?.toString()}
                </TableCell>
              ))}
            </motion.tr>
          ))}
        </TableBody>
      </Table>

      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a2a3e]">
          <p className="text-sm text-gray-500">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
            {pagination.totalItems} results
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(1)}
              className="text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              className="text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 text-sm text-gray-400">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              className="text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.totalPages)}
              className="text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
