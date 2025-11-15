/**
 * 合并类名的工具函数
 * 简单的类名合并实现，支持字符串、对象、数组等
 * 
 * @param inputs - 类名输入，可以是字符串、对象、数组等
 * @returns 合并后的类名字符串
 * 
 * @example
 * cn('foo', 'bar') // => 'foo bar'
 * cn('foo', { bar: true }) // => 'foo bar'
 * cn('foo', null, undefined, false, 'bar') // => 'foo bar'
 */
export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean> | string[])[]): string {
  const classes: string[] = []
  
  for (const input of inputs) {
    if (!input) continue
    
    if (typeof input === 'string') {
      classes.push(input)
    } else if (Array.isArray(input)) {
      const inner = cn(...input)
      if (inner) classes.push(inner)
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) {
          classes.push(key)
        }
      }
    }
  }
  
  return classes.join(' ')
}

