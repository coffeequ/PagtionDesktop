export class GoogleProvderAuth {

    gmailMy: string;

    client_id: string | undefined;

    client_secret_id: string | undefined;

    scopes: string[]

    constructor(gmailMy: string){
        this.client_id = process.env.GOOGLE_CLIENT_ID;
        
        this.client_secret_id = process.env.GOOGLE_CLIENT_SECRET;

        this.gmailMy = gmailMy;
        
        this.scopes = [`user:${this.gmailMy}`];
    }
}