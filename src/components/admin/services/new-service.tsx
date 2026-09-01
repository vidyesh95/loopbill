import {useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Calendar as CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {cn} from "@/lib/utils";

interface NewServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewServiceModal = ({isOpen, onClose}: NewServiceModalProps) => {
    const [formData, setFormData] = useState({
        customer: "",
        serviceType: "",
        agent: "",
        location: "",
        phone: "",
        amount: ""
    });
    const [selectedDate, setSelectedDate] = useState<Date>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("New service data:", {...formData, date: selectedDate});
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Schedule New Service</DialogTitle>
                    <DialogDescription>
                        Create a new pest control service appointment
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="customer">Customer Name</Label>
                            <Input
                                id="customer"
                                value={formData.customer}
                                onChange={(e) => setFormData({...formData, customer: e.target.value})}
                                placeholder="Enter customer name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder="+91 9876543210"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="Building, Wing, Flat No."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Service Type</Label>
                            <Select value={formData.serviceType}
                                    onValueChange={(value) => setFormData({...formData, serviceType: value})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select service"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cockroach">Cockroach Control</SelectItem>
                                    <SelectItem value="rodent">Rodent Control</SelectItem>
                                    <SelectItem value="termite">Termite Control</SelectItem>
                                    <SelectItem value="mosquito">Mosquito Treatment</SelectItem>
                                    <SelectItem value="ant">Ant Control</SelectItem>
                                    <SelectItem value="bedbug">Bed Bug Treatment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Assign Agent</Label>
                            <Select value={formData.agent}
                                    onValueChange={(value) => setFormData({...formData, agent: value})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select agent"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="raj">Raj Kumar</SelectItem>
                                    <SelectItem value="sanjay">Sanjay Singh</SelectItem>
                                    <SelectItem value="amit">Amit Sharma</SelectItem>
                                    <SelectItem value="priya">Priya Patel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Service Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !selectedDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        autoFocus
                                        className="pointer-events-auto"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (₹)</Label>
                            <Input
                                id="amount"
                                value={formData.amount}
                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                placeholder="2500"
                                type="number"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 cursor-pointer">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 cursor-pointer">
                            Schedule Service
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewServiceModal;