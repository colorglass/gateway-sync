import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { ModbusField } from "@/types/device";

interface ModbusFieldConfigProps {
  fields: ModbusField[];
  onFieldsChange: (fields: ModbusField[]) => void;
}

const dataTypes = [
  { value: "UInt16", label: "UInt16 (无符号16位)" },
  { value: "Int16", label: "Int16 (有符号16位)" },
  { value: "Int32", label: "Int32 (有符号32位)" },
  { value: "Float16", label: "Float16 (16位浮点)" },
  { value: "Float32", label: "Float32 (32位浮点)" },
];

const formatTypes = [
  { value: "ABCD", label: "ABCD (大端)" },
  { value: "CDAB", label: "CDAB (小端)" },
  { value: "BADC", label: "BADC (字节交换)" },
  { value: "DCBA", label: "DCBA (完全反转)" },
];

const functionCodes = [
  { value: 1, label: "01 - 读取线圈状态" },
  { value: 2, label: "02 - 读取输入状态" },
  { value: 3, label: "03 - 读取保持寄存器" },
  { value: 4, label: "04 - 读取输入寄存器" },
];

export function ModbusFieldConfig({ fields, onFieldsChange }: ModbusFieldConfigProps) {
  const [editingField, setEditingField] = useState<number | null>(null);

  const addField = () => {
    const newField: ModbusField = {
      name: "",
      func: 4,
      addr: "0x0000",
      type: "UInt16",
      format: null,
      expr: null,
    };
    onFieldsChange([...fields, newField]);
    setEditingField(fields.length);
  };

  const updateField = (index: number, updates: Partial<ModbusField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    onFieldsChange(newFields);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    onFieldsChange(newFields);
    setEditingField(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Modbus数据字段配置</h3>
        <Button onClick={addField} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          添加字段
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {field.name || `字段 ${index + 1}`}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingField(editingField === index ? null : index)}
                  >
                    {editingField === index ? "收起" : "编辑"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeField(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {editingField === index && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`field-name-${index}`}>字段名称</Label>
                    <Input
                      id={`field-name-${index}`}
                      value={field.name}
                      onChange={(e) => updateField(index, { name: e.target.value })}
                      placeholder="例：temperature"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`field-func-${index}`}>功能码</Label>
                    <Select
                      value={field.func.toString()}
                      onValueChange={(value) => updateField(index, { func: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {functionCodes.map((func) => (
                          <SelectItem key={func.value} value={func.value.toString()}>
                            {func.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`field-addr-${index}`}>寄存器地址</Label>
                    <Input
                      id={`field-addr-${index}`}
                      value={field.addr}
                      onChange={(e) => updateField(index, { addr: e.target.value })}
                      placeholder="例：0x0001"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`field-type-${index}`}>数据类型</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value: ModbusField["type"]) => updateField(index, { type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dataTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(field.type === "Float32" || field.type === "Int32") && (
                    <div>
                      <Label htmlFor={`field-format-${index}`}>字节序格式</Label>
                      <Select
                        value={field.format || ""}
                        onValueChange={(value) => updateField(index, { 
                          format: value === "" ? null : value as ModbusField["format"] 
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择字节序" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">默认</SelectItem>
                          {formatTypes.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <Label htmlFor={`field-expr-${index}`}>数据转换表达式 (可选)</Label>
                    <Input
                      id={`field-expr-${index}`}
                      value={field.expr || ""}
                      onChange={(e) => updateField(index, { expr: e.target.value || null })}
                      placeholder="例：x / 100 (x为原始值)"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      使用变量x表示原始读取值，支持基本数学运算
                    </p>
                  </div>
                </div>
              </CardContent>
            )}

            {editingField !== index && (
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">功能码: </span>
                    <span className="text-foreground">{field.func}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">地址: </span>
                    <span className="text-foreground">{field.addr}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">类型: </span>
                    <span className="text-foreground">{field.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">格式: </span>
                    <span className="text-foreground">{field.format || "默认"}</span>
                  </div>
                </div>
                {field.expr && (
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">表达式: </span>
                    <code className="text-foreground bg-muted px-1 rounded">{field.expr}</code>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>暂无配置的Modbus字段</p>
          <p className="text-sm">点击"添加字段"开始配置</p>
        </div>
      )}
    </div>
  );
}