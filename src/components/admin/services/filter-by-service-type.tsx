import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterByServiceTypeProps {
  value: string;
  onValueChange: (value: string) => void;
}

const serviceTypes = [
  "Ant control",
  "Bed bug control",
  "Bird control",
  "Cockroach control",
  "Flea and Tick control",
  "Fly control",
  "General pest control",
  "Insect control",
  "Mosquito control",
  "Rodent",
  "Mosquito treatment",
  "Termite control",
  "Wildlife control",
];

export default function FilterByServiceType({ value, onValueChange }: FilterByServiceTypeProps) {
  return (
    <Select defaultValue="all" value={value} onValueChange={onValueChange}>
      <SelectTrigger className="cursor-pointer">
        <SelectValue placeholder="Filter by service type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter</SelectLabel>
          <SelectItem value="all">Filter by service type(All)</SelectItem>
          {serviceTypes.map((serviceType, index) => (
            <SelectItem key={index} value={serviceType}>
              {serviceType}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
