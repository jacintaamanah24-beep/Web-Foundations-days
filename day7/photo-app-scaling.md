# Day 7 Assignment: SnapShare Scaling Plan

## 1. Introduction

SnapShare is a photo-sharing application that allows users to upload photos and view photo feeds from people they follow.

As the application grows to 10 million registered users, its system must handle large numbers of photo uploads, feed requests and increasing storage requirements.

The goal of this scaling plan is to design a reliable, efficient and scalable system that can support normal and peak traffic.

## 2. Assumptions and Traffic Estimates

The following assumptions are provided for the SnapShare application:

- Registered users: 10,000,000
- Daily active users: 10% of registered users
- Each active user uploads 1 photo per day.
- Each active user views 50 feed pages per day.
- Average photo size: 2 MB.
- Thumbnail size: 50 KB.
- Seconds in one day: 86,400.
- Peak traffic is estimated at 5 times the average traffic.

### A. Daily Active Users (DAU)

**Calculation:**

10,000,000 × 10% = 1,000,000

**Answer:** SnapShare has approximately 1 million daily active users.

### B. Photo Uploads Per Second

Each active user uploads one photo per day.

**Daily uploads:**

1,000,000 × 1 = 1,000,000 photos per day.

**Average uploads per second:**

1,000,000 ÷ 86,400 = 11.57 uploads per second.

**Answer:** SnapShare receives approximately 12 photo uploads per second on average.

### C. Feed Views Per Second

Each active user views 50 feed pages per day.

**Daily feed views:**

1,000,000 × 50 = 50,000,000 feed views per day.

**Average feed views per second:**

50,000,000 ÷ 86,400 = approximately 579 views per second.

**Peak feed views per second:**

579 × 5 = approximately 2,895 views per second.

**Answer:** SnapShare should be designed to handle approximately 2,900 feed views per second during peak traffic.

### D. Annual Photo Storage

Each uploaded photo is 2 MB, and each photo also gets a 50 KB thumbnail.

For this calculation, 50 KB is treated as 0.05 MB.

**Combined storage per photo:**

2 MB + 0.05 MB = 2.05 MB.

**Daily storage:**

1,000,000 × 2.05 MB = 2,050,000 MB per day.

**Annual storage:**

2,050,000 × 365 = 748,250,000 MB per year.

**Answer:** SnapShare requires approximately 748.25 TB of storage per year for original photos and thumbnails, excluding backups, replicas and other overhead.

### E. Is SnapShare Read-Heavy or Write-Heavy?

SnapShare is a **read-heavy system** because users view photo feeds much more frequently than they upload photos.

The application handles approximately 50 million feed views per day compared to 1 million photo uploads per day.

This means feed views occur about 50 times more frequently than uploads.

To handle this traffic efficiently, SnapShare uses caching, database read replicas and a CDN to improve loading speed and reduce the workload on the primary database.

## 3. Why Photos Should Not Be Stored Inside the Database

Photos should not be stored directly inside the database because image files are large and can consume significant database storage space.

Storing large image files in the database can increase backup sizes, slow down database operations and make database management more expensive.

Instead, original photos and thumbnails should be stored in **object storage**, such as Amazon S3 or Azure Blob Storage.

The database should store only photo metadata, including the photo ID, user ID, file name, storage location and upload date.

This separation allows the database to manage structured information while object storage handles large image files.

## 4. System Architecture

SnapShare uses a distributed architecture with multiple components working together to handle photo uploads and feed requests.

### A. Architecture Text Diagram

```text
                    USERS / MOBILE APP
                            |
                +-----------+-----------+
                |                       |
                v                       v
               DNS                      CDN
                                        |
                                        v
                                  IMAGE DELIVERY

                    API REQUESTS
                         |
                         v
                   LOAD BALANCER
                         |
              +----------+----------+
              |          |          |
              v          v          v
            APP 1      APP 2      APP 3
              |          |          |
              +----------+----------+
                         |
              +----------+----------+
              |          |          |
              v          v          v
          CACHE       PRIMARY DB   MESSAGE QUEUE
         (Redis)         |              |
                         v              v
                    READ REPLICA   THUMBNAIL WORKER
                                        |
                                        v
                                  OBJECT STORAGE
                                  (Photos and
                                   Thumbnails)
```

### B. Explanation of Each Component

1. **Users / Mobile App:** Allows users to upload photos and view feeds from people they follow.

2. **DNS:** Translates the application's domain name into an IP address so users can reach the service.

3. **CDN (Content Delivery Network):** Delivers photos and thumbnails from nearby servers to reduce loading time and improve performance.

4. **Load Balancer:** Distributes incoming API requests across healthy application servers to prevent one server from becoming overloaded.

5. **Application Servers:** Process user authentication, photo uploads, feed requests and other application operations.

6. **Cache (Redis):** Stores frequently requested feed information in memory to reduce repeated database queries and improve response speed.

7. **Primary Database:** Stores user information and photo metadata and handles write operations.

8. **Read Replica:** Handles database read requests to reduce the workload on the primary database and improve read performance.

9. **Object Storage:** Stores original uploaded photos and generated thumbnails separately from the database.

10. **Message Queue:** Holds background jobs until a worker is ready to process them.

11. **Thumbnail Worker:** Retrieves jobs from the message queue and generates smaller versions of uploaded photos in the background.

## 5. Photo Upload Flow

When a user uploads a photo to SnapShare, the following steps take place:

1. The user selects a photo using the mobile application.
2. The application sends the upload request to the load balancer.
3. The load balancer forwards the request to a healthy application server.
4. The application server authenticates the user and validates the uploaded photo.
5. The original photo is uploaded to object storage.
6. The application server saves the photo metadata, including the photo ID, user ID and storage location, in the primary database.
7. The application server sends a thumbnail-generation job to the message queue.
8. The application confirms that the original photo has been uploaded successfully without waiting for thumbnail generation to finish.
9. The background thumbnail worker retrieves the job from the message queue.
10. The worker downloads the original photo, creates a smaller thumbnail and saves it in object storage.
11. The CDN delivers the original photo or thumbnail when other users view their feeds.

## 6. Scaling Strategies

SnapShare can handle increasing traffic through the following strategies:

- **Horizontal Scaling:** Add more application servers when user traffic increases so that requests are shared across multiple machines.
- **Caching:** Store frequently requested feed information in Redis to reduce database workload.
- **Database Replication:** Use a primary database for writes and read replicas to distribute read requests.
- **Object Storage:** Store photos separately from the main database to manage large image files efficiently.
- **CDN:** Deliver images from servers closer to users in different geographical locations.
- **Database Indexing:** Improve the speed of database queries by creating indexes on frequently searched fields.
- **Background Processing:** Use a message queue and thumbnail worker to process image tasks without delaying the main upload request.

## 7. System Design Trade-offs

### Trade-off 1: Caching vs Data Freshness

Caching improves performance because frequently requested information can be retrieved quickly without repeatedly querying the database.

However, cached information may become outdated when users upload new photos or update their profiles.

**Decision:** Use caching for frequently accessed feeds and refresh or invalidate cached information when necessary.

### Trade-off 2: Primary Database vs Read Replicas

Read replicas improve performance by distributing database read requests and reducing the workload on the primary database.

However, replication takes time, meaning a read replica may briefly contain outdated information.

**Decision:** Use the primary database for write operations and read replicas for feed-related read operations where a small replication delay is acceptable.

### Trade-off 3: Synchronous vs Asynchronous Thumbnail Generation

Generating thumbnails immediately during an upload can make them available sooner, but it increases the upload response time.

Using a message queue and background worker allows the application to respond faster because thumbnail generation happens separately.

However, thumbnails may take a short time to become available.

**Decision:** Use asynchronous thumbnail generation to improve upload performance and prevent image-processing tasks from slowing down the main application.

## 8. Conclusion

The proposed SnapShare architecture combines DNS, a CDN, load balancing, multiple application servers, caching, database replication, object storage, a message queue and background workers.

These components work together to handle high traffic, improve photo delivery, reduce database workload and support increasing storage requirements.

By using horizontal scaling and separating photo storage from database operations, SnapShare can provide a reliable and efficient service as the application grows to millions of users.