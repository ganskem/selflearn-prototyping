import React, { useState } from 'react';
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, ChevronRight, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus } from 'lucide-react';

const availableSkills = ["Skill A", "Skill B", "Skill C"];

const initialSkillHierarchy = {
  name: "Wissenschaftliches Arbeiten",
  children: [
    {
      name: "Lesen",
      children: [
        {
          name: "Leseprozess",
          children: [
            { name: "Zielbestimmung", children: [] },
            { name: "Durchsicht", children: [] },
            { name: "Nachbereitung", children: [] }
          ]
        },
        {
          name: "Literatursuche",
          children: [
            { name: "Wissenschaftliche Suchmasch.", children: [] },
            { name: "Stichwortsuche", children: [] }
          ]
        }
      ]
    }
  ]
};

// Helper function to find skill info
const findSkillInfo = (skillName, node, parentName = null) => {
  if (node.name === skillName) {
    return {
      name: node.name,
      children: node.children.map(child => child.name),
      parents: parentName ? [parentName] : []
    };
  }
  
  for (const child of node.children) {
    const found = findSkillInfo(skillName, child, node.name);
    if (found) return found;
  }
  
  return null;
};

const SkillEditor = () => {
  const [selectedSkill, setSelectedSkill] = useState({
    name: "Leseprozess",
    children: ["Zielbestimmung", "Durchsicht", "Nachbereitung"],
    parents: ["Lesen"]
  });

  const [expandedNodes, setExpandedNodes] = useState(new Set(['Wissenschaftliches Arbeiten', 'Lesen', 'Leseprozess', 'Literatursuche']));

  const [skillHierarchy, setSkillHierarchy] = useState(initialSkillHierarchy);
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);

  const toggleNode = (e, nodeName) => {
    e.stopPropagation();
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeName)) {
        newSet.delete(nodeName);
      } else {
        newSet.add(nodeName);
      }
      return newSet;
    });
  };

  const handleAddSkill = (skillName) => {
    setSkillHierarchy(prev => ({
      ...prev,
      children: [...prev.children, { name: skillName, children: [] }]
    }));
    setIsAddSkillDialogOpen(false);
  };
  
  const handleRemoveSkill = (skillName) => {
    setSkillHierarchy(prev => ({
      ...prev,
      children: prev.children.filter(child => child.name !== skillName)
    }));
  };

  const handleSkillClick = (skillName) => {
    const skillInfo = findSkillInfo(skillName, skillHierarchy);
    if (skillInfo) {
      setSelectedSkill(skillInfo);
    }
  };

  // Recursive component for skill hierarchy
  const SkillHierarchy = ({ skill, depth = 0 }) => {
    const hasChildren = skill.children && skill.children.length > 0;
    const isExpanded = expandedNodes.has(skill.name);
    const isSelected = selectedSkill.name === skill.name;
    const isRemovable = depth === 1 && !['Lesen'].includes(skill.name);

    return (
      <div className="ml-4">
        {depth > 0 && (
          <div 
            className={`flex items-center gap-2 py-1 group cursor-pointer ${isSelected ? 'text-blue-600 font-medium' : ''}`}
            onClick={() => handleSkillClick(skill.name)}
          >
            {hasChildren ? (
              <button
                onClick={(e) => toggleNode(e, skill.name)}
                className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="w-4" />
            )}
            <span className="text-sm hover:text-blue-600 transition-colors">
              {skill.name}
            </span>
            {isRemovable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveSkill(skill.name);
                }}
                className="p-0 h-6 w-6 ml-2"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        )}
        {hasChildren && isExpanded && (
          <div className="border-l border-gray-200 ml-2">
            {skill.children.map((child, index) => (
              <SkillHierarchy key={index} skill={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="flex gap-6">
        {/* Left Side - Skill Editor */}
        <div className="w-1/3 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Repository auswählen</h3>
                  <div className="bg-gray-200 p-2 rounded text-sm">
                    Wissenschaftliches Arbeiten
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-green-600 mb-2">Skill bearbeiten</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <Input value={selectedSkill.name} className="bg-gray-100" readOnly />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Beschreibung</label>
                      <Textarea className="h-24 bg-gray-100" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Beinhaltet folgende Skills (Kinder):
                      </label>
                      <div className="space-y-2">
                        {selectedSkill.children.map((child, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                            {child}
                            <Button variant="ghost" size="sm" className="ml-auto p-0 h-auto">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ist Teil von folgenden Skills (Eltern):
                      </label>
                      <div className="space-y-2">
                        {selectedSkill.parents.map((parent, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                            {parent}
                            <Button variant="ghost" size="sm" className="ml-auto p-0 h-auto">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Skill Hierarchy */}
        <div className="w-2/3">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Wissenschaftliches Arbeiten</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddSkillDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Skill hinzufügen
              </Button>
              <div className="border rounded p-4">
                <SkillHierarchy skill={skillHierarchy} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isAddSkillDialogOpen} onOpenChange={setIsAddSkillDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skill hinzufügen</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {availableSkills
              .filter(skill => !skillHierarchy.children.some(child => child.name === skill))
              .map((skill, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start"
                  onClick={() => handleAddSkill(skill)}
                >
                  {skill}
                </Button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillEditor;