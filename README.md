# Metrc Wrapper - interact with Metrc in your Node application #

Interacting with Metrc's API requires certification. You'll need API keys to use the library.

# What the heck is Metrc anyway???

Metrc is the Cannabis Tracking System (CTS) used in most States where recreational cannabis is legal 
(and even in some that still only offer Medical Marijuana). Metrc is built and maintained by Franwell Inc.,
and is only accessible to licensees, verified integrators and other authorized entities. 

# What's the Metrc API?

While Metrc includes a Web based interface for licensess to interact with, it also includes an API to 
allow software vendors to programmatically update Metrc data. The API does not necassarily provide
all of the functionality of the Web based interface, but is the only way 3rd parties can report data 
into Metrc. 

# Why can't I just start using the API? What possible benefit could this open source project provide?

Every software vendor in the Cannabis space is currently writing their own code for accessing and interacting
with the Metrc API. This library is not intended to be a production ready replacement for writing your own
code (though you're welcome to use it). It provides a partial implementation to highlight some of the 
peculiarities others have encountered, hopefully saving some of your sanity in the process.

For example, when you POST a new record, the API returns a status code of 200 . . . and that's it. Since you'll
likely need to determine the "Id" of the record you just created, an empty response payload is less than
optimal. So, this library wraps each POST with a corresponding GET, and logic to extract the newly introduced
record. Likewise, the GET endpoints force you to page through data based on the "LastModified" field, and only
allow a short time span (beginning 4/1/2018 requests are limited to no more than a 24 hour period). This library
provides a way to make multiple calls in a single method call (though be careful . . . call limits and throttling
rules are always subject to change and could cause issues).



