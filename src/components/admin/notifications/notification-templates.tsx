import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

interface NotificationTemplate {
    id: number,
    cardTitle: string,
    cardDescription: string,
    subject: string,
    message: string
}

const notificationTemplates: NotificationTemplate[] = [
    {
        id: 1,
        cardTitle: "Service Reminder",
        cardDescription: "Remind customers about upcoming services",
        subject: "Service Reminder - {service_type}",
        message: "Your {service_type} service is scheduled for {date}..."
    },
    {
        id: 2,
        cardTitle: "Payment Due",
        cardDescription: "Notify customers about pending payments",
        subject: "Payment Due - Invoice #{invoice_number}",
        message: "Your payment of ₹{amount} is due on {due_date}..."
    },
    {
        id: 3,
        cardTitle: "Service Completion",
        cardDescription: "Confirm service completion with customers",
        subject: "Service Completion - {service_type}",
        message: "Your {service_type} service was completed on {date}..."
    },
    {
        id: 4,
        cardTitle: "Promotional Offer",
        cardDescription: "Inform customers about new offers and discounts",
        subject: "New Offer - {offer_name}",
        message: "Enjoy {discount}% off on {offer_name} valid until {expiry_date}..."
    },
    {
        id: 5,
        cardTitle: "Feedback Request",
        cardDescription: "Request feedback after service completion",
        subject: "Feedback Request - {service_type}",
        message: "We value your feedback! Please share your experience with our {service_type} service..."
    }
]

export default function NotificationTemplates({templates = notificationTemplates}: {templates?: NotificationTemplate[]}) {
    return (
        <section className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
        {
            templates.map(notificationTemplate => (
                    <Card key={notificationTemplate.id}>
                        <CardHeader>
                            <CardTitle>{notificationTemplate.cardTitle}</CardTitle>
                            <CardDescription>{notificationTemplate.cardDescription}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className={"font-semibold"}>Subject: <span
                                className={"font-normal"}>{notificationTemplate.subject}</span></p>
                            <p className={"font-semibold"}>Message: <span
                                className={"font-normal"}>{notificationTemplate.message}</span>
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant={"outline"}>Edit</Button>
                            <Button className={"ml-2"}>Use template</Button>
                        </CardFooter>
                    </Card>
                )
            )
        }
        </section>
    )
}