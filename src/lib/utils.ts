import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并 Tailwind CSS 类名，自动处理冲突
 * 基于 `clsx` + `tailwind-merge`，支持条件类名和类名合并
 *
 * @param inputs - Tailwind CSS 类名或条件表达式
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
