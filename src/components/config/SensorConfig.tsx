import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Settings } from "lucide-react";
import { Telemetry, SendGroup } from "@/types/device";
import { ModbusFieldConfig } from "./ModbusFieldConfig";

interface SensorConfigProps {
  telemetries: Telemetry[];
  sendGroups: SendGroup[];
  onTelemetriesChange: (telemetries: Telemetry[]) => void;
}

export function SensorConfig({ telemetries, sendGroups, onTelemetriesChange }: SensorConfigProps) {
  const [editingSensor, setEditingSensor] = useState<number | null>(null);

  const addSensor = () => {
    const newSensor: Telemetry = {
      name: "",
      desc: "",
      group: "",
      addr: 1,
      fields: [],
    };
    onTelemetriesChange([...telemetries, newSensor]);
    setEditingSensor(telemetries.length);
  };

  const updateSensor = (index: number, updates: Partial<Telemetry>) => {
    const newTelemetries = [...telemetries];
    newTelemetries[index] = { ...newTelemetries[index], ...updates };
    onTelemetriesChange(newTelemetries);
  };

  const removeSensor = (index: number) => {
    const newTelemetries = telemetries.filter((_, i) => i !== index);
    onTelemetriesChange(newTelemetries);
    setEditingSensor(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">传感器配置</h2>
          <p className="text-muted-foreground">配置Modbus传感器和数据字段</p>
        </div>
        <Button onClick={addSensor} className="gap-2">
          <Plus className="w-4 h-4" />
          添加传感器
        </Button>
      </div>

      <div className="space-y-4">
        {telemetries.map((sensor, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sensor-primary/10 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-sensor-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {sensor.name || `传感器 ${index + 1}`}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      地址: {sensor.addr} | 组: {sensor.group || "未分组"} | 字段: {sensor.fields.length}个
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingSensor(editingSensor === index ? null : index)}
                  >
                    {editingSensor === index ? "收起" : "配置"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSensor(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {editingSensor === index && (
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">基本信息</TabsTrigger>
                    <TabsTrigger value="fields">数据字段</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`sensor-name-${index}`}>传感器名称</Label>
                        <Input
                          id={`sensor-name-${index}`}
                          value={sensor.name}
                          onChange={(e) => updateSensor(index, { name: e.target.value })}
                          placeholder="例：AD130"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`sensor-addr-${index}`}>Modbus地址</Label>
                        <Input
                          id={`sensor-addr-${index}`}
                          type="number"
                          value={sensor.addr}
                          onChange={(e) => updateSensor(index, { addr: parseInt(e.target.value) || 1 })}
                          min="1"
                          max="247"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`sensor-group-${index}`}>发送组</Label>
                        <Select
                          value={sensor.group}
                          onValueChange={(value) => updateSensor(index, { group: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择发送组" />
                          </SelectTrigger>
                          <SelectContent>
                            {sendGroups.map((group) => (
                              <SelectItem key={group.name} value={group.name}>
                                {group.name} ({group.interval}ms)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor={`sensor-desc-${index}`}>描述</Label>
                        <Textarea
                          id={`sensor-desc-${index}`}
                          value={sensor.desc}
                          onChange={(e) => updateSensor(index, { desc: e.target.value })}
                          placeholder="传感器描述信息"
                          rows={3}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="fields" className="mt-4">
                    <ModbusFieldConfig
                      fields={sensor.fields}
                      onFieldsChange={(fields) => updateSensor(index, { fields })}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {telemetries.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="text-center py-12">
            <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">暂无配置的传感器</h3>
            <p className="text-muted-foreground mb-4">开始添加您的第一个Modbus传感器</p>
            <Button onClick={addSensor} className="gap-2">
              <Plus className="w-4 h-4" />
              添加传感器
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}