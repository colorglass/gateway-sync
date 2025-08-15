import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Clock, Wifi } from "lucide-react";
import { SendGroup, RemoteServer } from "@/types/device";

interface SendGroupConfigProps {
  sendGroups: SendGroup[];
  remoteServers: RemoteServer[];
  onSendGroupsChange: (sendGroups: SendGroup[]) => void;
}

export function SendGroupConfig({ sendGroups, remoteServers, onSendGroupsChange }: SendGroupConfigProps) {
  const [editingGroup, setEditingGroup] = useState<number | null>(null);
  const [newTopic, setNewTopic] = useState("");

  const addGroup = () => {
    const newGroup: SendGroup = {
      name: "",
      interval: 1000,
      topics: [],
      remote: "",
    };
    onSendGroupsChange([...sendGroups, newGroup]);
    setEditingGroup(sendGroups.length);
  };

  const updateGroup = (index: number, updates: Partial<SendGroup>) => {
    const newGroups = [...sendGroups];
    newGroups[index] = { ...newGroups[index], ...updates };
    onSendGroupsChange(newGroups);
  };

  const removeGroup = (index: number) => {
    const newGroups = sendGroups.filter((_, i) => i !== index);
    onSendGroupsChange(newGroups);
    setEditingGroup(null);
  };

  const addTopic = (groupIndex: number) => {
    if (newTopic.trim()) {
      const group = sendGroups[groupIndex];
      const updatedTopics = [...group.topics, newTopic.trim()];
      updateGroup(groupIndex, { topics: updatedTopics });
      setNewTopic("");
    }
  };

  const removeTopic = (groupIndex: number, topicIndex: number) => {
    const group = sendGroups[groupIndex];
    const updatedTopics = group.topics.filter((_, i) => i !== topicIndex);
    updateGroup(groupIndex, { topics: updatedTopics });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">发送组配置</h2>
          <p className="text-muted-foreground">配置数据采集周期和MQTT发送策略</p>
        </div>
        <Button onClick={addGroup} className="gap-2">
          <Plus className="w-4 h-4" />
          添加发送组
        </Button>
      </div>

      <div className="space-y-4">
        {sendGroups.map((group, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {group.name || `发送组 ${index + 1}`}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>间隔: {group.interval}ms</span>
                      <span>主题: {group.topics.length}个</span>
                      <span>服务器: {group.remote || "未配置"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingGroup(editingGroup === index ? null : index)}
                  >
                    {editingGroup === index ? "收起" : "配置"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeGroup(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {editingGroup === index && (
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`group-name-${index}`}>组名称</Label>
                    <Input
                      id={`group-name-${index}`}
                      value={group.name}
                      onChange={(e) => updateGroup(index, { name: e.target.value })}
                      placeholder="例：group1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`group-interval-${index}`}>采集间隔 (毫秒)</Label>
                    <Input
                      id={`group-interval-${index}`}
                      type="number"
                      value={group.interval}
                      onChange={(e) => updateGroup(index, { interval: parseInt(e.target.value) || 1000 })}
                      min="100"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`group-remote-${index}`}>远程服务器</Label>
                    <Select
                      value={group.remote}
                      onValueChange={(value) => updateGroup(index, { remote: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择服务器" />
                      </SelectTrigger>
                      <SelectContent>
                        {remoteServers.map((server) => (
                          <SelectItem key={server.name} value={server.name}>
                            {server.name} ({server.broker}:{server.port})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>MQTT主题列表</Label>
                  <div className="space-y-3 mt-2">
                    <div className="flex gap-2">
                      <Input
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="输入MQTT主题，例：/sensor/data"
                        onKeyPress={(e) => e.key === "Enter" && addTopic(index)}
                      />
                      <Button 
                        onClick={() => addTopic(index)}
                        disabled={!newTopic.trim()}
                      >
                        添加
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {group.topics.map((topic, topicIndex) => (
                        <Badge
                          key={topicIndex}
                          variant="secondary"
                          className="flex items-center gap-1 pr-1"
                        >
                          <Wifi className="w-3 h-3" />
                          {topic}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => removeTopic(index, topicIndex)}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                    </div>

                    {group.topics.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        请添加至少一个MQTT主题
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">配置说明</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 采集间隔决定了传感器数据的读取频率</li>
                    <li>• 同一发送组的传感器将使用相同的采集周期</li>
                    <li>• 数据将发送到配置的所有MQTT主题</li>
                    <li>• 建议根据数据重要性设置不同的采集间隔</li>
                  </ul>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {sendGroups.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">暂无配置的发送组</h3>
            <p className="text-muted-foreground mb-4">创建发送组来管理数据采集和发送策略</p>
            <Button onClick={addGroup} className="gap-2">
              <Plus className="w-4 h-4" />
              添加发送组
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}